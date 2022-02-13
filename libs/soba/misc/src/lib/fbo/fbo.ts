import {
    NgtCanvasStore,
    NgtSize,
    NgtStore,
    tapEffect,
} from '@angular-three/core';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import * as THREE from 'three';

interface FBOSettings<T extends boolean = false>
    extends THREE.WebGLRenderTargetOptions {
    multisample?: T;
    samples?: number;
}

export type FBOReturn<T extends boolean = false> = T extends true
    ? THREE.WebGLRenderTarget | THREE.WebGLMultisampleRenderTarget
    : THREE.WebGLRenderTarget;

interface NgtSobaFBOState {
    target: THREE.WebGLRenderTarget | THREE.WebGLMultisampleRenderTarget;
    dpr: number;
    width: number;
    height: number;
    settings: FBOSettings<boolean>;
}

@Injectable()
export class NgtSobaFBO extends NgtStore<NgtSobaFBOState> {
    private dprParams$ = this.select(
        this.canvasStore.renderer$,
        this.canvasStore.ready$,
        (renderer) => ({ dpr: renderer.getPixelRatio() })
    );

    private targetParams$ = this.select(
        this.select((s) => s.width),
        this.select((s) => s.height),
        this.select((s) => s.settings),
        this.canvasStore.ready$,
        (width, height, settings) => {
            const { multisample, samples, ...targetSettings } = settings || {};

            let target;
            if (
                multisample &&
                this.canvasStore.get((s) => s.renderer).capabilities.isWebGL2
            ) {
                target = new THREE.WebGLMultisampleRenderTarget(
                    width,
                    height,
                    targetSettings as THREE.WebGLRenderTargetOptions
                );
                if (samples) target.samples = samples;
            } else {
                target = new THREE.WebGLRenderTarget(
                    width,
                    height,
                    targetSettings as THREE.WebGLRenderTargetOptions
                );
            }
            return { target };
        }
    );

    private fboSettingsParams$ = this.select(
        this.select((s) => s.dpr),
        this.canvasStore.select((s) => s.size),
        this.canvasStore.ready$,
        (dpr, size) => ({ dpr, size })
    );

    private sizeParams$ = this.select(
        this.select((s) => s.target),
        this.select((s) => s.width),
        this.select((s) => s.height),
        (target, width, height) => ({ target, width, height })
    );

    constructor(private canvasStore: NgtCanvasStore) {
        super();
    }

    use<T extends boolean = false>(
        settings?: FBOSettings<T>
    ): Observable<FBOReturn<T>>;

    use<T extends boolean = false>(
        width?: number,
        height?: number,
        settings?: FBOSettings<T>
    ): Observable<FBOReturn<T>>;
    use<T extends boolean = false>(
        width?: number | FBOSettings<T>,
        height?: number,
        settings?: FBOSettings<T>
    ): Observable<FBOReturn<T>> {
        this.set(this.dprParams$);
        this.set(this.targetParams$);
        this.setFboSettings(width, height, settings);
        this.setSize(this.sizeParams$);
        this.destroy(this.select((s) => s.target));

        return this.select((s) => s.target);
    }

    private readonly destroy = this.effect<NgtSobaFBOState['target']>(
        tapEffect((target) => {
            return () => {
                target.dispose();
            };
        })
    );

    private readonly setSize = this.effect<
        Pick<NgtSobaFBOState, 'target' | 'width' | 'height'>
    >(
        tap(({ target, height, width }) => {
            target.setSize(width, height);
        })
    );

    private setFboSettings<T extends boolean = false>(
        width?: number | FBOSettings<T>,
        height?: number,
        settings?: FBOSettings<T>
    ) {
        return this.effect<{ dpr: number; size: NgtSize }>(
            tap(({ dpr, size }) => {
                this.set({
                    width: typeof width === 'number' ? width : size.width * dpr,
                    height:
                        typeof height === 'number' ? height : size.height * dpr,
                    settings:
                        (typeof width === 'number'
                            ? settings
                            : (width as FBOSettings)) || {},
                });
            })
        )(this.fboSettingsParams$);
    }
}
