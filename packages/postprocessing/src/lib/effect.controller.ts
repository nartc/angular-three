// GENERATED
import {
  AnyConstructor,
  Controller,
  createControllerProviderFactory,
  NgtStore,
  startWithUndefined,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import {
  Directive,
  Inject,
  Injectable,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  OnInit,
  Optional,
} from '@angular/core';
import { BlendFunction, Effect } from 'postprocessing';
import { combineLatest, map } from 'rxjs';
import { NgtEffectComposerStore } from './effect-composer.store';

export const NGT_EFFECT_TYPE = new InjectionToken<AnyConstructor<Effect>>(
  'Effect Type'
);

export const NGT_EFFECT_DEFAULT_BLEND_FUNCTION =
  new InjectionToken<BlendFunction>('Effect Blend Function', {
    providedIn: 'root',
    factory: () => BlendFunction.NORMAL,
  });

interface NgtEffectState {
  options?: ConstructorParameters<AnyConstructor<Effect>>[0];
  blendFunction: BlendFunction;
  opacity?: number;
  effect?: Effect;
}

@Injectable()
export class NgtEffectStore extends NgtStore<NgtEffectState> {
  // readonly actions = asyncActions<{ init: void }>();

  private effectChanges$ = combineLatest([
    this.select('effect'),
    this.select('blendFunction'),
    this.select('opacity').pipe(startWithUndefined()),
  ]).pipe(
    map(([effect, blendFunction, opacity]) => ({
      effect,
      blendFunction,
      opacity,
    }))
  );

  constructor(
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

    this.set({
      blendFunction: defaultBlendFunction,
    });
  }

  /**
   * zoneless
   */
  init() {
    zonelessRequestAnimationFrame(() => {
      const effect = new this.effectType(this.get('options'));
      this.effectComposerStore.set((state) => ({
        effects: [...state.effects, effect],
      }));
      this.set({ effect });

      this.hold(this.effectChanges$, ({ effect, blendFunction, opacity }) => {
        if (effect) {
          effect.blendMode.blendFunction =
            blendFunction || this.defaultBlendFunction;
          if (opacity !== undefined) {
            effect.blendMode.opacity.value = opacity;
          }
        }
      });
    });
  }
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
  providers: [NgtEffectStore],
})
export class NgtEffectController extends Controller implements OnInit {
  @Input() set opacity(opacity: number) {
    this.effectStore.set({ opacity });
  }

  @Input() set blendFunction(blendFunction: BlendFunction) {
    this.effectStore.set({ blendFunction });
  }

  @Input() set options(
    options: ConstructorParameters<AnyConstructor<Effect>>[0]
  ) {
    this.effectStore.set({ options });
  }

  constructor(zone: NgZone, private effectStore: NgtEffectStore) {
    super(zone);
  }

  get effect() {
    return this.effectStore.get('effect') as Effect;
  }

  override ngOnInit() {
    super.ngOnInit();
    this.effectStore.init();
  }
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
