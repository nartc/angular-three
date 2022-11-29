import { defaultProjector, filterFalsy, NgtComponentStore, NgtRef, NgtStore, tapEffect } from '@angular-three/core';
import { inject, Injectable } from '@angular/core';
import { isObservable, Observable, of, tap } from 'rxjs';
import * as THREE from 'three';

interface FBOSettings<T extends boolean = false> extends THREE.WebGLRenderTargetOptions {
    multisample?: T;
    samples?: number;
}

interface SobaFBOState {
    target: NgtRef<THREE.WebGLRenderTarget>;
    width: number;
    height: number;
    settings: FBOSettings<boolean>;
}

export interface SobaFBOParams<T extends boolean = false> {
    width?: number | FBOSettings<T>;
    height?: number;
    settings?: FBOSettings<T>;
}

@Injectable()
export class SobaFBO extends NgtComponentStore<SobaFBOState> {
    private readonly store = inject(NgtStore);

    constructor() {
        super();
        this.write({ target: new NgtRef() });
    }

    private readonly setTarget = this.effect<SobaFBOParams>(
        tap(({ width, height, settings }) => {
            const targetRef = this.read((s) => s.target);
            const { gl, size, viewport } = this.store.read();

            const _width = typeof width === 'number' ? width : size.width * viewport.dpr;
            const _height = typeof height === 'number' ? height : size.height * viewport.dpr;
            const _settings = (typeof width === 'number' ? settings : (width as FBOSettings)) || {};

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

            this.write({ width: _width, height: _height, settings: _settings });
        })
    );

    private readonly setup = this.effect(
        tapEffect(() => {
            const {
                target,
                width,
                height,
                settings: { samples },
            } = this.read();

            target.value.setSize(width, height);
            if (samples) target.value.samples = samples;

            return ({ complete }) => {
                if (complete) {
                    target.value.dispose();
                }
            };
        })
    );

    use<T extends boolean = false>(
        paramsFactory: (defaultParams: Partial<SobaFBOParams<T>>) => SobaFBOParams<T> | Observable<SobaFBOParams<T>>
    ): NgtRef<THREE.WebGLRenderTarget> {
        const targetRef = this.read((s) => s.target);
        const params = paramsFactory({});
        const params$ = isObservable(params) ? params : of(params);

        this.setTarget(params$ as Observable<SobaFBOParams>);
        this.setup(
            this.select(
                targetRef.pipe(filterFalsy()),
                this.select((s) => s.width),
                this.select((s) => s.height),
                this.select((s) => s.settings),
                defaultProjector,
                { debounce: true }
            )
        );

        return targetRef;
    }
}
