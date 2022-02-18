// GENERATED
import {
    AnyConstructor,
    Controller,
    createControllerProviderFactory,
    NgtCanvasStore,
    NgtStore,
    startWithUndefined,
} from '@angular-three/core';
import {
    Directive,
    Inject,
    InjectionToken,
    Input,
    NgModule,
    NgZone,
    OnInit,
    Optional,
} from '@angular/core';
import { BlendFunction, Effect } from 'postprocessing';
import { tap } from 'rxjs';
import { NgtEffectComposerStore } from './effect-composer.store';

export const NGT_EFFECT_TYPE = new InjectionToken<AnyConstructor<Effect>>(
    'Effect Type'
);

export const NGT_EFFECT_DEFAULT_BLEND_FUNCTION =
    new InjectionToken<BlendFunction>('Effect Blend Function', {
        factory: () => BlendFunction.NORMAL,
    });

interface NgtEffectState {
    options?: ConstructorParameters<AnyConstructor<Effect>>[0];
    blendFunction: BlendFunction;
    opacity?: number;
    effect?: Effect;
}

@Directive({
    selector: `
        ngt-bloom,
        ngt-brightness-contrast,
        ngt-color-depth,
        ngt-depth,
        ngt-dot-screen,
        ngt-hue-saturation,
        ngt-noise,
        ngt-scanline,
        ngt-sepia,
        ngt-shock-wave,
        ngt-tone-mapping,
        ngt-vignette
    `,
    exportAs: 'ngtEffectController',
    providers: [NgtStore],
})
export class NgtEffectController extends Controller implements OnInit {
    @Input() set opacity(opacity: number) {
        this.store.set({ opacity });
    }

    @Input() set blendFunction(blendFunction: BlendFunction) {
        this.store.set({ blendFunction });
    }

    @Input() set options(
        options: ConstructorParameters<AnyConstructor<Effect>>[0]
    ) {
        this.store.set({ options });
    }

    constructor(
        private zone: NgZone,
        private store: NgtStore<NgtEffectState>,
        private canvasStore: NgtCanvasStore,
        @Optional()
        @Inject(NGT_EFFECT_TYPE)
        private effectType: AnyConstructor<Effect>,
        @Inject(NGT_EFFECT_DEFAULT_BLEND_FUNCTION)
        private defaultBlendFunction: BlendFunction,
        @Optional() private effectComposerStore: NgtEffectComposerStore
    ) {
        super();
        if (!effectComposerStore) {
            throw new Error(`Effects need to be inside of ngt-effect-composer`);
        }

        if (!effectType) {
            throw new Error('NGT_EFFECT_TYPE is required');
        }

        this.store.set({
            blendFunction: defaultBlendFunction,
        });
    }

    get effect() {
        return this.store.get((s) => s.effect) as Effect;
    }

    private effectParams$ = this.store.select(
        this.store.select((s) => s.effect),
        this.store.select((s) => s.blendFunction),
        this.store.select((s) => s.opacity).pipe(startWithUndefined()),
        (effect, blendFunction, opacity) => ({ effect, blendFunction, opacity })
    );

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.store.onCanvasReady(this.canvasStore.ready$, () => {
                const effect = new this.effectType(
                    this.store.get((s) => s.options)
                );
                this.effectComposerStore.set((state) => ({
                    effects: [...state.effects, effect],
                }));
                this.store.set({ effect });

                this.configureEffect(this.effectParams$);
            });
        });
    }

    private readonly configureEffect = this.store.effect<
        Pick<NgtEffectState, 'effect' | 'blendFunction' | 'opacity'>
    >(
        tap(({ effect, blendFunction, opacity }) => {
            if (effect) {
                effect.blendMode.blendFunction =
                    blendFunction || this.defaultBlendFunction;
                if (opacity !== undefined) {
                    effect.blendMode.opacity.value = opacity;
                }
            }
        })
    );
}

@NgModule({
    declarations: [NgtEffectController],
    exports: [NgtEffectController],
})
export class NgtEffectControllerModule {}

export const [NGT_EFFECT_WATCH_CONTROLLER, NGT_EFFECT_CONTROLLER_PROVIDER] =
    createControllerProviderFactory({
        controller: NgtEffectController,
        watchedControllerTokenName: 'Watched EffectController',
    });
