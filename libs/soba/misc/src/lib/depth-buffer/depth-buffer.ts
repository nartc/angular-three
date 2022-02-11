import {
    NgtAnimationFrameStore,
    NgtCanvasStore,
    NgtSize,
    NgtStore,
    NgtViewport,
    tapEffect,
} from '@angular-three/core';
import { Injectable } from '@angular/core';
import { map, Observable, pipe, switchMap, tap } from 'rxjs';
import * as THREE from 'three';
import { FBOReturn, NgtSobaFBO } from '../fbo/fbo';

interface NgtSobaDepthBufferState {
    size: number;
    frames: number;
    width: number;
    height: number;
    fbo: FBOReturn;
    depthConfig: { depthTexture: THREE.DepthTexture };
}

@Injectable()
export class NgtSobaDepthBuffer extends NgtStore<NgtSobaDepthBufferState> {
    private dimensionsParams$ = this.select(
        this.canvasStore.select((s) => s.size),
        this.canvasStore.select((s) => s.viewport),
        this.canvasStore.ready$,
        (size, viewport) => ({ size, viewport })
    );

    private depthConfig$ = this.select(
        this.select((s) => s.width),
        this.select((s) => s.height),
        (width, height) => {
            const depthTexture = new THREE.DepthTexture(width, height);
            depthTexture.format = THREE.DepthFormat;
            depthTexture.type = THREE.UnsignedShortType;

            if (this.canvasStore.get((s) => s.linear)) {
                depthTexture.encoding = THREE.LinearEncoding;
            } else {
                depthTexture.encoding = THREE.sRGBEncoding;
            }

            return { depthConfig: { depthTexture } };
        }
    );

    private depthFBOParams$ = this.select(
        this.select((s) => s.width),
        this.select((s) => s.height),
        this.select((s) => s.depthConfig),
        (width, height, depthConfig) => ({ width, height, depthConfig })
    );

    constructor(
        private sobaFbo: NgtSobaFBO,
        private canvasStore: NgtCanvasStore,
        private animationFrameStore: NgtAnimationFrameStore
    ) {
        super();
        this.set({ size: 256, frames: Infinity });
    }

    use(
        options: { size?: number; frames?: number } = {}
    ): Observable<FBOReturn['depthTexture']> {
        if (options.size) {
            this.set({ size: options.size });
        }

        if (options.frames) {
            this.set({ frames: options.frames });
        }

        this.setDimensions(this.dimensionsParams$);
        this.set(this.depthConfig$);
        this.registerAnimation(this.depthFBOParams$);

        return this.select((s) => s.fbo).pipe(map((fbo) => fbo.depthTexture));
    }

    private readonly setDimensions = this.effect<{
        size: NgtSize;
        viewport: NgtViewport;
    }>(
        tap(({ size: { width, height }, viewport: { dpr } }) => {
            const size = this.get((s) => s.size);
            this.set({
                width: size || width * dpr,
                height: size || height * dpr,
            });
        })
    );

    private readonly registerAnimation = this.effect<
        Pick<NgtSobaDepthBufferState, 'width' | 'height' | 'depthConfig'>
    >(
        pipe(
            switchMap(({ width, height, depthConfig }) =>
                this.sobaFbo.use(width, height, depthConfig)
            ),
            tapEffect((depthFBO) => {
                this.set({ fbo: depthFBO });
                let count = 0;
                const animationUuid = this.animationFrameStore.register({
                    callback: ({ renderer, scene, camera }) => {
                        const frames = this.get((s) => s.frames);
                        if (frames === Infinity || count < frames) {
                            renderer.setRenderTarget(depthFBO);
                            renderer.render(scene, camera);
                            renderer.setRenderTarget(null);
                            count++;
                        }
                    },
                });

                return () => {
                    this.animationFrameStore.unregister(animationUuid);
                };
            })
        )
    );
}

export const NGT_SOBA_DEPTH_BUFFER_PROVIDER = [NgtSobaFBO, NgtSobaDepthBuffer];
