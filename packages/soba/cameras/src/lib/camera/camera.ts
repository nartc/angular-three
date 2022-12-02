import {
    defaultProjector,
    filterFalsy,
    NgtCamera,
    NgtCompound,
    NgtObservableInput,
    NgtRef,
    tapEffect,
} from '@angular-three/core';
import { SobaFBO } from '@angular-three/soba/misc';
import { Directive, inject, Input, OnInit } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';

@Directive()
export abstract class SobaCamera<TCamera extends NgtCamera> extends NgtCompound<TCamera> implements OnInit {
    @Input() set makeDefault(makeDefault: NgtObservableInput<boolean>) {
        this.write({ makeDefault });
    }

    @Input() set manual(manual: NgtObservableInput<boolean>) {
        this.write({ manual });
    }

    @Input() set frames(frames: NgtObservableInput<boolean>) {
        this.write({ frames });
    }

    @Input() set resolution(resolution: NgtObservableInput<boolean>) {
        this.write({ resolution });
    }

    @Input() set envMap(envMap: NgtObservableInput<THREE.Texture>) {
        this.write({ envMap });
    }

    protected readonly fbo = inject(SobaFBO);

    private readonly setFBO = this.effect(
        tap(() => {
            const resolution = this.read((s) => s['resolution']);
            this.write({
                fboRef: this.fbo.use(() => ({ width: resolution })),
            });
        })
    );

    private readonly updateProjectionMatrix = this.effect(
        tap(() => {
            if (!this.read((s) => s['manual'])) {
                this.instanceRef.value.updateProjectionMatrix();
            }
        })
    );

    private readonly setDefaultCamera = this.effect(
        tapEffect(() => {
            if (this.read((s) => s['makeDefault'])) {
                const { camera: oldCamera, cameraRef: oldCameraRef } = this.store.read();
                this.store.write({ camera: this.instanceRef.value, cameraRef: this.instanceRef });
                return () => this.store.write({ camera: oldCamera, cameraRef: oldCameraRef });
            }
        })
    );

    override initialize() {
        super.initialize();
        this.write({
            resolution: 256,
            frames: Infinity,
            makeDefault: false,
            manual: false,
            groupRef: new NgtRef(),
            fboRef: new NgtRef(),
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            requestAnimationFrame(() => {
                this.instanceRef.value.updateProjectionMatrix();
            });
            this.setFBO(this.select((s) => s['resolution'], { debounce: true }));
            const instanceRef$ = this.instanceRef.pipe(filterFalsy());
            this.setDefaultCamera(
                this.select(
                    this.select((s) => s['makeDefault']),
                    instanceRef$,
                    defaultProjector,
                    { debounce: true }
                )
            );
            this.updateProjectionMatrix(
                this.select(
                    this.select((s) => s['manual']),
                    instanceRef$,
                    defaultProjector,
                    { debounce: true }
                )
            );

            // if (this.cameraContent && this.cameraContent.useFBO) {
            //     let count = 0;
            //     let oldEnvMap: THREE.Color | THREE.Texture | null = null;
            //     this.effect<void>(
            //       tapEffect(() =>
            //         this.store.registerBeforeRender({
            //           callback: (state) => {
            //             const frames = this.getState((s) => s['frames']);
            //             const envMap = this.getState((s) => s['envMap']);
            //             const groupRef = this.groupRef;
            //             const fboRef = this.fboRef;
            //             if (groupRef.value && fboRef.value && (frames === Infinity || count < frames)) {
            //               groupRef.value.visible = false;
            //               state.gl.setRenderTarget(fboRef.value);
            //               oldEnvMap = state.scene.background;
            //               if (envMap) state.scene.background = envMap;
            //               state.gl.render(state.scene, this.instanceValue);
            //               state.scene.background = oldEnvMap;
            //               state.gl.setRenderTarget(null);
            //               groupRef.value.visible = true;
            //               count++;
            //             }
            //           },
            //         })
            //       )
            //     )();
            //   }
        });
    }
}
