// GENERATED
import {
  AnyConstructor,
  Controller,
  createControllerProviderFactory,
  EnhancedComponentStore,
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
import { tap } from 'rxjs';

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
export class NgtEffectStore extends EnhancedComponentStore<NgtEffectStoreState> {
  #blendChanges$ = this.select(
    this.selectors.blendFunction$,
    this.selectors.opacity$,
    this.selectors.effect$,
    (blendFunction, opacity, effect) => ({ blendFunction, opacity, effect }),
    { debounce: true }
  );

  constructor(
    private ngZone: NgZone,
    @Optional()
    @Inject(NGT_EFFECT_TYPE)
    private effectType: AnyConstructor<Effect>,
    @Inject(NGT_EFFECT_DEFAULT_BLEND_FUNCTION)
    private defaultBlendFunction: BlendFunction
  ) {
    super({
      opacity: undefined,
      blendFunction: defaultBlendFunction,
      options: undefined,
      effect: undefined,
    });
    if (!effectType) {
      throw new Error('NGT_EFFECT_TYPE is required');
    }
  }

  readonly init = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.#construct(this.selectors.options$);
        this.#blendChange(this.#blendChanges$);
      })
    )
  );

  #construct = this.effect<ConstructorParameters<AnyConstructor<Effect>>[0]>(
    (options$) =>
      options$.pipe(
        tap((options) => {
          this.ngZone.runOutsideAngular(() => {
            this.patchState({
              effect: new this.effectType(options),
            });
          });
        })
      )
  );

  #blendChange = this.effect<{
    blendFunction: BlendFunction;
    opacity?: number;
    effect?: Effect;
  }>((changes$) =>
    changes$.pipe(
      tap(({ blendFunction, opacity, effect }) => {
        this.ngZone.runOutsideAngular(() => {
          if (effect) {
            effect.blendMode.blendFunction =
              blendFunction || this.defaultBlendFunction;
            if (opacity !== undefined) {
              effect.blendMode.opacity.value = opacity;
            }
          }
        });
      })
    )
  );
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
    this.effectStore.updaters.setOpacity(v);
  }

  @Input() set blendFunction(v: BlendFunction) {
    this.effectStore.updaters.setBlendFunction(v);
  }

  @Input() set options(v: ConstructorParameters<AnyConstructor<Effect>>[0]) {
    this.effectStore.updaters.setOptions(v);
  }

  constructor(ngZone: NgZone, private effectStore: NgtEffectStore) {
    super(ngZone);
  }

  get effect() {
    return this.effectStore.getImperativeState().effect as Effect;
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.effectStore.init();
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
