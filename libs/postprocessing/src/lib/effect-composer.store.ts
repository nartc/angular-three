import {
    NGT_IS_WEBGL_AVAILABLE,
    NgtAnimationFrameStore,
    NgtCanvasStore,
    NgtSize,
    NgtStore,
    startWithUndefined,
    tapEffect,
} from '@angular-three/core';
import { Inject, Injectable, NgZone } from '@angular/core';
import {
    Effect,
    EffectComposer,
    EffectPass,
    NormalPass,
    RenderPass,
} from 'postprocessing';
import { map, startWith, tap } from 'rxjs';
import * as THREE from 'three';

export interface NgtEffectComposerState {
    autoClear: boolean;
    multisampling: number;
    renderPriority: number;
    composer: EffectComposer;
    depthBuffer?: boolean;
    disableNormalPass?: boolean;
    stencilBuffer?: boolean;
    effects: Effect[];
    frameBufferType?: THREE.TextureDataType;
    camera: THREE.Camera;
    scene: THREE.Scene;
    normalPass?: NormalPass;
}

@Injectable()
export class NgtEffectComposerStore extends NgtStore<NgtEffectComposerState> {
    private composerInitParams$ = this.select(
        this.select((s) => s.camera).pipe(
            startWith(this.canvasStore.get((s) => s.camera))
        ),
        this.select((s) => s.scene).pipe(
            startWith(this.canvasStore.get((s) => s.scene))
        ),
        this.select((s) => s.depthBuffer).pipe(startWithUndefined()),
        this.select((s) => s.stencilBuffer).pipe(startWithUndefined()),
        this.select((s) => s.multisampling),
        this.select((s) => s.frameBufferType).pipe(startWithUndefined()),
        this.select((s) => s.disableNormalPass).pipe(startWithUndefined()),
        (
            camera,
            scene,
            depthBuffer,
            stencilBuffer,
            multisampling,
            frameBufferType,
            disableNormalPass
        ) => ({
            camera,
            scene,
            depthBuffer,
            stencilBuffer,
            multisampling,
            frameBufferType,
            disableNormalPass,
        })
    );

    private composerSizeParams$ = this.select(
        this.select((s) => s.composer),
        this.canvasStore.select((s) => s.size),
        (composer, size) => ({ composer, size })
    );

    private registerAnimationParams$ = this.select(
        this.select((s) => s.composer),
        this.select((s) => s.autoClear),
        this.select((s) => s.renderPriority),
        (composer, autoClear, renderPriority) => ({
            composer,
            autoClear,
            renderPriority,
        })
    );

    private effectPassesParams$ = this.select(
        this.select((s) => s.composer),
        this.select((s) => s.effects),
        this.select((s) => s.camera).pipe(
            startWith(this.canvasStore.get((s) => s.camera))
        ),
        (composer, effects, camera) => ({ composer, effects, camera })
    );

    constructor(
        private zone: NgZone,
        private canvasStore: NgtCanvasStore,
        private animationFrameStore: NgtAnimationFrameStore,
        @Inject(NGT_IS_WEBGL_AVAILABLE) private isWebGLAvailable: boolean
    ) {
        super();
        this.set({
            autoClear: true,
            multisampling: 8,
            renderPriority: 1,
            camera: canvasStore.get((s) => s.camera),
            scene: canvasStore.get((s) => s.scene),
            effects: [],
        });
    }

    init() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.set(
                    this.canvasStore
                        .select((s) => s.camera)
                        .pipe(map((camera) => ({ camera })))
                );
                this.set(
                    this.canvasStore
                        .select((s) => s.scene)
                        .pipe(map((scene) => ({ scene })))
                );

                this.initComposer(this.composerInitParams$);
                this.setSize(this.composerSizeParams$);
                this.registerAnimation(this.registerAnimationParams$);
                this.configureEffectPasses(this.effectPassesParams$);
            });
        });
    }

    private readonly initComposer = this.effect<
        Pick<
            NgtEffectComposerState,
            | 'camera'
            | 'scene'
            | 'depthBuffer'
            | 'stencilBuffer'
            | 'multisampling'
            | 'frameBufferType'
            | 'disableNormalPass'
        >
    >(
        tap(
            ({
                camera,
                scene,
                depthBuffer,
                stencilBuffer,
                multisampling,
                frameBufferType,
                disableNormalPass,
            }) => {
                const renderer = this.canvasStore.get((s) => s.renderer);
                if (renderer && scene && camera) {
                    const effectComposer = new EffectComposer(renderer, {
                        depthBuffer,
                        stencilBuffer,
                        multisampling: this.isWebGLAvailable
                            ? multisampling
                            : 0,
                        frameBufferType,
                    });

                    effectComposer.addPass(new RenderPass(scene, camera));

                    const normalPass = disableNormalPass
                        ? undefined
                        : new NormalPass(scene, camera);
                    if (normalPass) {
                        effectComposer.addPass(normalPass);
                    }

                    this.set({
                        normalPass,
                        composer: effectComposer,
                    });
                }
            }
        )
    );

    private readonly setSize = this.effect<{
        composer: EffectComposer;
        size: NgtSize;
    }>(
        tap(({ composer, size: { width, height } }) => {
            if (composer) {
                composer.setSize(width, height);
            }
        })
    );

    private readonly registerAnimation = this.effect<
        Pick<
            NgtEffectComposerState,
            'composer' | 'autoClear' | 'renderPriority'
        >
    >(
        tapEffect(({ composer, autoClear, renderPriority }) => {
            const renderer = this.canvasStore.get((s) => s.renderer);
            const animationUuid = this.animationFrameStore.register({
                callback: ({ delta }) => {
                    renderer.autoClear = autoClear;
                    composer.render(delta);
                },
                priority: renderPriority,
            });
            return () => {
                this.animationFrameStore.unregister(animationUuid);
            };
        })
    );

    private readonly configureEffectPasses = this.effect<
        Pick<NgtEffectComposerState, 'composer' | 'effects' | 'camera'>
    >(
        tapEffect(({ composer, effects, camera }) => {
            let effectPass: EffectPass;

            if (effects.length) {
                effectPass = new EffectPass(camera, ...effects);
                composer.addPass(effectPass);
                effectPass.renderToScreen = true;
            }

            return () => {
                if (effectPass) {
                    composer.removePass(effectPass);
                }
            };
        })
    );
}
