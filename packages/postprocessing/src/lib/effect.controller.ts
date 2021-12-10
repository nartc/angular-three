// GENERATED
import {
  AnyConstructor,
  Controller,
  createControllerProviderFactory,
  EnhancedRxState,
  getActions,
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
// @ts-ignore
import { BlendFunction, Effect } from 'postprocessing';

export const NGT_EFFECT_TYPE = new InjectionToken<AnyConstructor<Effect>>(
  'Effect Type'
);

export const NGT_EFFECT_DEFAULT_BLEND_FUNCTION =
  new InjectionToken<BlendFunction>('Effect Blend Function', {
    providedIn: 'root',
    factory: () => BlendFunction.NORMAL,
  });

interface NgtEffectStoreState {
  options: ConstructorParameters<AnyConstructor<Effect>>[0];
  blendFunction: BlendFunction;
  opacity?: number;
  effect?: Effect;
}

@Injectable()
export class NgtEffectStore extends EnhancedRxState<NgtEffectStoreState> {
  actions = getActions<{ init: void }>();

  constructor(
    @Optional()
    @Inject(NGT_EFFECT_TYPE)
    effectType: AnyConstructor<Effect>,
    @Inject(NGT_EFFECT_DEFAULT_BLEND_FUNCTION)
    defaultBlendFunction: BlendFunction
  ) {
    super();

    if (!effectType) {
      throw new Error('NGT_EFFECT_TYPE is required');
    }

    this.set({
      opacity: undefined,
      blendFunction: defaultBlendFunction,
      options: undefined,
      effect: undefined,
    });

    this.connect(
      'effect',
      this.actions.init$,
      (state) => new effectType(state.options)
    );

    this.hold(this.actions.init$, () => {
      const { blendFunction, opacity, effect } = this.get();
      if (effect) {
        effect.blendMode.blendFunction = blendFunction || defaultBlendFunction;
        if (opacity !== undefined) {
          effect.blendMode.opacity.value = opacity;
        }
      }
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
  @Input() set opacity(v: number) {
    this.effectStore.set({ opacity: v });
  }

  @Input() set blendFunction(v: BlendFunction) {
    this.effectStore.set({ blendFunction: v });
  }

  @Input() set options(v: ConstructorParameters<AnyConstructor<Effect>>[0]) {
    this.effectStore.set({ options: v });
  }

  constructor(ngZone: NgZone, private effectStore: NgtEffectStore) {
    super(ngZone);
  }

  get effect() {
    return this.effectStore.get('effect') as Effect;
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.effectStore.actions.init();
    });
  }

  get controller(): Controller | undefined {
    return undefined;
  }

  get props(): string[] {
    return [];
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
