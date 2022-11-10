// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtObservableInput,
  coerceBoolean,
  NgtBooleanInput,
  coerceNumber,
  NgtNumberInput,
} from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { isObservable, map } from 'rxjs';
import { Directive, Input } from '@angular/core';
import { VignetteEffect, VignetteTechnique } from 'postprocessing';

@Directive({
  selector: 'ngt-vignette-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtVignetteEffect), provideCommonEffectRef(NgtVignetteEffect)],
})
export class NgtVignetteEffect extends NgtCommonEffect<VignetteEffect> {
  override get effectType(): NgtAnyConstructor<VignetteEffect> {
    return VignetteEffect;
  }

  @Input() set technique(technique: NgtObservableInput<VignetteTechnique>) {
    this.set({ technique });
  }

  @Input() set eskil(eskil: NgtObservableInput<NgtBooleanInput>) {
    this.set({ eskil: isObservable(eskil) ? eskil.pipe(map(coerceBoolean)) : coerceBoolean(eskil) });
  }

  @Input() set offset(offset: NgtObservableInput<NgtNumberInput>) {
    this.set({ offset: isObservable(offset) ? offset.pipe(map(coerceNumber)) : coerceNumber(offset) });
  }

  @Input() set darkness(darkness: NgtObservableInput<NgtNumberInput>) {
    this.set({ darkness: isObservable(darkness) ? darkness.pipe(map(coerceNumber)) : coerceNumber(darkness) });
  }

  override get effectPropFields(): string[] {
    return [...super.effectPropFields, 'technique', 'eskil', 'offset', 'darkness'];
  }
}
