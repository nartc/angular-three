import {
  coerceNumber,
  createNgtProvider,
  createRefInjection,
  getInstanceLocalState,
  NgtAnyConstructor,
  NgtInstance,
  NgtNumberInput,
  NgtObservableInput,
  NgtPrepareInstanceFn,
  provideInstanceRef,
  provideNgtInstance,
  skipFirstUndefined,
} from '@angular-three/core';
import { Directive, inject, Input } from '@angular/core';
import { BlendFunction, Effect } from 'postprocessing';
import { isObservable, map, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtEffectComposer } from './effect-composer';

export const [injectCommonEffectRef, provideCommonEffectRef, NGT_COMMON_EFFECT_REF] = createRefInjection(
  'NgtCommonEffect ref',
  provideInstanceRef
);

@Directive()
export abstract class NgtCommonEffect<TEffect extends Effect = Effect> extends NgtInstance<TEffect> {
  @Input() set opacity(opacity: NgtObservableInput<NgtNumberInput>) {
    this.set({
      opacity: isObservable(opacity) ? opacity.pipe(map(coerceNumber)) : coerceNumber(opacity),
    });
  }

  @Input() set blendFunction(blendFunction: NgtObservableInput<BlendFunction>) {
    this.set({ blendFunction });
  }

  protected effectComposer = inject(NgtEffectComposer, { skipSelf: true });

  protected get defaultBlendMode(): BlendFunction {
    return BlendFunction.NORMAL;
  }

  abstract get effectType(): NgtAnyConstructor<TEffect>;

  private readonly configureBlendMode = this.effect(
    tap(() => {
      const invalidate = this.store.getState((s) => s.invalidate);
      const { opacity, blendFunction } = this.getState();

      this.instanceValue.blendMode.blendFunction =
        !blendFunction && blendFunction !== 0 ? this.defaultBlendMode : blendFunction;

      if (opacity !== undefined) {
        this.instanceValue.blendMode.opacity.value = opacity;
      }

      invalidate();
    })
  );

  override initTrigger$ = this.select(
    [...this.effectPropFields.map((field) => ({ name: field })), ...this.extraEffectArgs].reduce(
      (selectors, { name, fromComposer }: { name: string; fromComposer?: boolean }) => {
        if (fromComposer) {
          selectors[name] = this.effectComposer.select((s) => s[name]);
        } else {
          if (!selectors[name]) {
            selectors[name] = this.select((s) => s[name]);

            // a hack for LUT effect for now
            if (name === 'lut') {
              selectors[name] = selectors[name].pipe(skipFirstUndefined());
            }
          }
        }

        return selectors;
      },
      {} as Record<string, any>
    ),
    { debounce: true }
  );

  override initialize() {
    super.initialize();
    this.set({ blendFunction: this.defaultBlendMode });
  }

  override initFn(prepareInstance: NgtPrepareInstanceFn<TEffect>): (() => void) | void | undefined {
    const effect = prepareInstance(new this.effectType(...this.initEffectArgs()));

    return () => {
      const parent = getInstanceLocalState(effect)?.parentRef?.value;
      if (parent && (parent as unknown as THREE.Group).isGroup) {
        getInstanceLocalState(parent)?.objectsRefs.set((refs) => refs.filter((ref) => ref.value !== effect));
      }

      effect.dispose();
    };
  }

  protected initEffectArgs(): unknown[] {
    const effectOptions: Record<string, unknown> = {};
    for (const field of this.effectPropFields) {
      effectOptions[field] = this.getState((s) => s[field]);
    }
    return [effectOptions];
  }

  protected get extraEffectArgs(): Array<{
    name: string;
    fromComposer?: boolean;
  }> {
    return [];
  }

  override postInit() {
    super.postInit();
    this.configureBlendMode(
      this.select(
        this.select((s) => s['opacity']),
        this.select((s) => s['blendFunction']),
        this.instanceRef,
        this.defaultProjector,
        { debounce: true }
      )
    );
  }

  protected get effectPropFields(): string[] {
    return ['blendFunction'];
  }
}

export const provideNgtCommonEffect = createNgtProvider(NgtCommonEffect, provideNgtInstance);
