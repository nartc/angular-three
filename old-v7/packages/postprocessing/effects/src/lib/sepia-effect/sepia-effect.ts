// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtObservableInput, coerceNumber, NgtNumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { isObservable, map } from 'rxjs';
import { Directive, Input } from '@angular/core';
import { SepiaEffect } from 'postprocessing';

@Directive({
  selector: 'ngt-sepia-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtSepiaEffect), provideCommonEffectRef(NgtSepiaEffect)],
})
export class NgtSepiaEffect extends NgtCommonEffect<SepiaEffect> {
  override get effectType(): NgtAnyConstructor<SepiaEffect> {
    return SepiaEffect;
  }

  @Input() set intensity(intensity: NgtObservableInput<NgtNumberInput>) {
    this.set({ intensity: isObservable(intensity) ? intensity.pipe(map(coerceNumber)) : coerceNumber(intensity) });
  }

  override get effectPropFields(): string[] {
    return [...super.effectPropFields, 'intensity'];
  }
}