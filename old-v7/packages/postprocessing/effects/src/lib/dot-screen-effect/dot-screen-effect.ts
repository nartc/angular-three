// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtObservableInput, coerceNumber, NgtNumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { isObservable, map } from 'rxjs';
import { Directive, Input } from '@angular/core';
import { DotScreenEffect } from 'postprocessing';

@Directive({
  selector: 'ngt-dot-screen-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtDotScreenEffect), provideCommonEffectRef(NgtDotScreenEffect)],
})
export class NgtDotScreenEffect extends NgtCommonEffect<DotScreenEffect> {
  override get effectType(): NgtAnyConstructor<DotScreenEffect> {
    return DotScreenEffect;
  }

  @Input() set angle(angle: NgtObservableInput<NgtNumberInput>) {
    this.set({ angle: isObservable(angle) ? angle.pipe(map(coerceNumber)) : coerceNumber(angle) });
  }

  @Input() set scale(scale: NgtObservableInput<NgtNumberInput>) {
    this.set({ scale: isObservable(scale) ? scale.pipe(map(coerceNumber)) : coerceNumber(scale) });
  }

  override get effectPropFields(): string[] {
    return [...super.effectPropFields, 'angle', 'scale'];
  }
}
