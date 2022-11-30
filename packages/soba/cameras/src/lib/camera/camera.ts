import {
    defaultProjector,
    filterFalsy,
    NgtCamera,
    NgtCompound,
    NgtObservableInput,
    NgtRef,
    NgtStore,
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

    protected readonly store = inject(NgtStore);
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
                this.store.write({ camera: this, cameraRef: this.instanceRef });
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
            this.setFBO(this.select((s) => s['resolution']));
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
        });
    }
}
