import {
    NgtComponentStore,
    NgtStore,
    Ref,
    tapEffect,
} from '@angular-three/core';
import { Injectable } from '@angular/core';
import { filter } from 'rxjs';
import * as THREE from 'three';

interface FBOSettings<T extends boolean = false>
    extends THREE.WebGLRenderTargetOptions {
    multisample?: T;
    samples?: number;
}

interface NgtSobaFBOState {
    target: Ref<THREE.WebGLRenderTarget>;
    width: number;
    height: number;
    settings: FBOSettings<boolean>;
}

@Injectable()
export class NgtSobaFBO extends NgtComponentStore<NgtSobaFBOState> {
    constructor(private store: NgtStore) {
        super();
        this.set({ target: new Ref() });
    }

    use<T extends boolean = false>(
        settings?: FBOSettings<T>
    ): Ref<THREE.WebGLRenderTarget>;
    use<T extends boolean = false>(
        width?: number,
        height?: number,
        settings?: FBOSettings<T>
    ): Ref<THREE.WebGLRenderTarget>;
    use<T extends boolean = false>(
        width?: number | FBOSettings<T>,
        height?: number,
        settings?: FBOSettings<T>
    ): Ref<THREE.WebGLRenderTarget> {
        const targetRef = this.get((s) => s.target);

        this.onCanvasReady(this.store.ready$, () => {
            const { gl, size, viewport } = this.store.get();

            const _width =
                typeof width === 'number' ? width : size.width * viewport.dpr;
            const _height =
                typeof height === 'number'
                    ? height
                    : size.height * viewport.dpr;
            const _settings =
                (typeof width === 'number'
                    ? settings
                    : (width as FBOSettings)) || {};

            const { samples, ...targetSettings } = _settings;

            targetRef.set(() => {
                const target = new THREE.WebGLRenderTarget(_width, _height, {
                    minFilter: THREE.LinearFilter,
                    magFilter: THREE.LinearFilter,
                    type: THREE.HalfFloatType,
                    encoding: gl.outputEncoding,
                    ...(targetSettings || {}),
                });
                if (samples) {
                    target.samples = samples;
                }
                return target;
            });

            this.set({
                width: _width,
                height: _height,
                settings: _settings,
            });

            this.setup(
                this.select(
                    targetRef.pipe(filter((target) => !!target)),
                    this.select((s) => s.width),
                    this.select((s) => s.height),
                    this.select((s) => s.settings)
                )
            );
        });

        return targetRef;
    }

    private readonly setup = this.effect<{}>(
        tapEffect(() => {
            const {
                target,
                width,
                height,
                settings: { samples },
            } = this.get();

            target.value.setSize(width, height);
            if (samples) target.value.samples = samples;

            return ({ complete }) => {
                if (complete) {
                    target.value.dispose();
                }
            };
        })
    );
}
