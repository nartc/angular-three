import {
    AnyFunction,
    NGT_INSTANCE_FACTORY,
    NGT_IS_WEBGL_AVAILABLE,
    NgtInstance,
    NgtInstanceState,
    NgtStore,
    provideInstanceFactory,
    startWithUndefined,
    tapEffect,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    Input,
    NgModule,
    NgZone,
    Optional,
    SkipSelf,
} from '@angular/core';
import {
    DepthDownsamplingPass,
    Effect,
    EffectComposer,
    EffectPass,
    NormalPass,
    RenderPass,
} from 'postprocessing';
import { map, tap } from 'rxjs';
import * as THREE from 'three';

export interface NgtEffectComposerState
    extends NgtInstanceState<EffectComposer> {
    normalPass: NormalPass | null;
    depthDownSamplingPass: DepthDownsamplingPass | null;

    renderPriority: number;
    autoClear: boolean;
    multisampling: number;
    frameBufferType: THREE.TextureDataType;
    enabled: boolean;
    depthBuffer?: boolean;
    disableNormalPass?: boolean;
    stencilBuffer?: boolean;
    resolutionScale?: number;
    camera?: THREE.Camera;
    scene?: THREE.Scene;
}

@Component({
    selector: 'ngt-effect-composer',
    template: ` <ng-content></ng-content> `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        provideInstanceFactory<EffectComposer, NgtEffectComposerState>(
            NgtEffectComposer
        ),
    ],
})
export class NgtEffectComposer extends NgtInstance<
    EffectComposer,
    NgtEffectComposerState
> {
    @Input() set enabled(enabled: boolean) {
        this.set({ enabled });
    }

    @Input() set depthBuffer(depthBuffer: boolean) {
        this.set({ depthBuffer });
    }

    @Input() set disableNormalPass(disableNormalPass: boolean) {
        this.set({ disableNormalPass });
    }

    @Input() set stencilBuffer(stencilBuffer: boolean) {
        this.set({ stencilBuffer });
    }

    @Input() set autoClear(autoClear: boolean) {
        this.set({ autoClear });
    }

    @Input() set resolutionScale(resolutionScale: number) {
        this.set({ resolutionScale });
    }

    @Input() set multisampling(multisampling: number) {
        this.set({ multisampling });
    }

    @Input() set frameBufferType(frameBufferType: THREE.TextureDataType) {
        this.set({ frameBufferType });
    }

    @Input() set renderPriority(renderPriority: number) {
        this.set({ renderPriority });
    }

    @Input() set camera(camera: THREE.Camera) {
        this.set({ camera });
    }

    @Input() set scene(scene: THREE.Scene) {
        this.set({ scene });
    }

    private readonly composerInitParams$ = this.select(
        this.store.select((s) => s.gl),
        this.select((s) => s.camera),
        this.select((s) => s.scene),
        this.select((s) => s.depthBuffer).pipe(startWithUndefined()),
        this.select((s) => s.stencilBuffer).pipe(startWithUndefined()),
        this.select((s) => s.multisampling),
        this.select((s) => s.frameBufferType),
        this.select((s) => s.disableNormalPass).pipe(startWithUndefined()),
        this.select((s) => s.resolutionScale).pipe(startWithUndefined()),
        () => ({})
    );

    private readonly sizeParams$ = this.select(
        this.select((s) => s.instance.value),
        this.store.select((s) => s.size),
        () => ({})
    );

    private readonly beforeRenderParams$ = this.select(
        this.select((s) => s.instance.value),
        this.select((s) => s.autoClear),
        this.select((s) => s.enabled),
        this.select((s) => s.renderPriority),
        () => ({})
    );

    private readonly effectPassesParams$ = this.select(
        this.select((s) => s.camera),
        this.select((s) => s.normalPass),
        this.select((s) => s.depthDownSamplingPass),
        this.select((s) => s.instance.value),
        this.select((s) => s.instance.value.__ngt__.objects),
        () => ({})
    );

    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_FACTORY)
        parentInstanceFactory: AnyFunction,
        @Inject(NGT_IS_WEBGL_AVAILABLE)
        private isWebGLAvailable: boolean
    ) {
        super({ zone, store, parentInstanceFactory });
        this.set({
            enabled: true,
            renderPriority: 1,
            autoClear: true,
            multisampling: 8,
            camera: store.get((s) => s.camera),
            scene: store.get((s) => s.scene),
            frameBufferType: THREE.HalfFloatType,
        });
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.set(
                    this.store
                        .select((s) => s.camera)
                        .pipe(map((camera) => ({ camera })))
                );
                this.set(
                    this.store
                        .select((s) => s.scene)
                        .pipe(map((scene) => ({ scene })))
                );

                this.init(this.composerInitParams$);
                this.setSize(this.sizeParams$);
                this.setBeforeRender(this.beforeRenderParams$);
                this.effectPasses(this.effectPassesParams$);
            });
        });
        super.ngOnInit();
    }

    private readonly init = this.effect<{}>(
        tap(() => {
            const { gl } = this.store.get();
            const {
                scene,
                camera,
                depthBuffer,
                stencilBuffer,
                multisampling,
                frameBufferType,
                disableNormalPass,
                resolutionScale,
            } = this.get();

            if (gl && scene && camera) {
                const effectComposer = this.prepareInstance(
                    new EffectComposer(gl, {
                        depthBuffer,
                        stencilBuffer,
                        multisampling:
                            multisampling > 0 && this.isWebGLAvailable
                                ? multisampling
                                : 0,
                        frameBufferType,
                    })
                );

                effectComposer.addPass(new RenderPass(scene, camera));

                // Create normal pass
                let downSamplingPass = null;
                let normalPass = null;

                if (!disableNormalPass) {
                    normalPass = new NormalPass(scene, camera);
                    normalPass.enabled = false;
                    effectComposer.addPass(normalPass);
                    if (
                        resolutionScale !== undefined &&
                        this.isWebGLAvailable
                    ) {
                        downSamplingPass = new DepthDownsamplingPass({
                            normalBuffer: normalPass.texture,
                            resolutionScale,
                        });
                        downSamplingPass.enabled = false;
                        effectComposer.addPass(downSamplingPass);
                    }
                }

                this.set({
                    depthDownSamplingPass: downSamplingPass,
                    normalPass,
                } as Partial<NgtEffectComposerState>);
            }
        })
    );

    private readonly setSize = this.effect<{}>(
        tap(() => {
            const composer = this.get((s) => s.instance);
            if (composer.value) {
                const size = this.store.get((s) => s.size);
                composer.value.setSize(size.width, size.height);
            }
        })
    );

    private readonly setBeforeRender = this.effect<{}>(
        tapEffect(() => {
            const { renderPriority, enabled } = this.get();
            const uuid = this.store.registerBeforeRender({
                callback: ({ delta }) => {
                    const gl = this.store.get((s) => s.gl);
                    const { instance, autoClear } = this.get();

                    if (enabled && instance.value) {
                        gl.autoClear = autoClear;
                        instance.value.render(delta);
                    }
                },
                priority: enabled ? renderPriority : 0,
            });

            return () => {
                this.store.unregisterBeforeRender(uuid);
            };
        })
    );

    private readonly effectPasses = this.effect<{}>(
        tapEffect(() => {
            let effectPass: EffectPass;
            const {
                instance: composer,
                camera,
                normalPass,
                depthDownSamplingPass,
            } = this.get();
            if (
                composer.value &&
                composer.value.__ngt__.objects.length &&
                camera
            ) {
                effectPass = new EffectPass(
                    camera,
                    ...(composer.value.__ngt__.objects as unknown as Effect[])
                );
                effectPass.renderToScreen = true;
                composer.value.addPass(effectPass);
                if (normalPass) {
                    normalPass.enabled = true;
                }

                if (depthDownSamplingPass) {
                    depthDownSamplingPass.enabled = true;
                }
            }

            return () => {
                if (effectPass) {
                    composer.value?.removePass(effectPass);
                }

                if (normalPass) {
                    normalPass.enabled = false;
                }

                if (depthDownSamplingPass) {
                    depthDownSamplingPass.enabled = false;
                }
            };
        })
    );
}

@NgModule({
    declarations: [NgtEffectComposer],
    exports: [NgtEffectComposer],
})
export class NgtEffectComposerModule {}
