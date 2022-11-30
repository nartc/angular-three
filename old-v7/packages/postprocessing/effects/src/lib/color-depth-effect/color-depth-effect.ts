// GENERATED - AngularThree v7.0.0
import { coerceNumber, NgtAnyConstructor, NgtNumberInput, NgtObservableInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { ColorDepthEffect } from 'postprocessing';
import { isObservable, map } from 'rxjs';

@Directive({
  selector: 'ngt-color-depth-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtColorDepthEffect), provideCommonEffectRef(NgtColorDepthEffect)],
})
export class NgtColorDepthEffect extends NgtCommonEffect<ColorDepthEffect> {
  override get effectType(): NgtAnyConstructor<ColorDepthEffect> {
    return ColorDepthEffect;
  }

  @Input() set bits(bits: NgtObservableInput<NgtNumberInput>) {
    this.set({ bits: isObservable(bits) ? bits.pipe(map(coerceNumber)) : coerceNumber(bits) });
  }

  override get effectPropFields(): string[] {
    return [...super.effectPropFields, 'bits'];
  }
}
