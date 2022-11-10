// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtObservableInput, coerceBoolean, NgtBooleanInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { isObservable, map } from 'rxjs';
import { Directive, Input } from '@angular/core';
import { BlendFunction, NoiseEffect } from 'postprocessing';

@Directive({
  selector: 'ngt-noise-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtNoiseEffect), provideCommonEffectRef(NgtNoiseEffect)],
})
export class NgtNoiseEffect extends NgtCommonEffect<NoiseEffect> {
  override get effectType(): NgtAnyConstructor<NoiseEffect> {
    return NoiseEffect;
  }

  @Input() set premultiply(premultiply: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      premultiply: isObservable(premultiply) ? premultiply.pipe(map(coerceBoolean)) : coerceBoolean(premultiply),
    });
  }

  override get defaultBlendMode(): BlendFunction {
    return BlendFunction.COLOR_DODGE;
  }

  override get effectPropFields(): string[] {
    return [...super.effectPropFields, 'premultiply'];
  }
}
