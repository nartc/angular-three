// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtObservableInput, coerceBoolean, NgtBooleanInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { isObservable, map } from 'rxjs';
import { Directive, Input } from '@angular/core';
import { DepthEffect } from 'postprocessing';

@Directive({
  selector: 'ngt-depth-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtDepthEffect), provideCommonEffectRef(NgtDepthEffect)],
})
export class NgtDepthEffect extends NgtCommonEffect<DepthEffect> {
  override get effectType(): NgtAnyConstructor<DepthEffect> {
    return DepthEffect;
  }

  @Input() set inverted(inverted: NgtObservableInput<NgtBooleanInput>) {
    this.set({ inverted: isObservable(inverted) ? inverted.pipe(map(coerceBoolean)) : coerceBoolean(inverted) });
  }

  override get effectPropFields(): string[] {
    return [...super.effectPropFields, 'inverted'];
  }
}
