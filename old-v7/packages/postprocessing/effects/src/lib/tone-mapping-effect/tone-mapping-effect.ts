// GENERATED - AngularThree v7.0.0
import {
  coerceBoolean,
  coerceNumber,
  NgtAnyConstructor,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObservableInput,
} from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { ToneMappingEffect, ToneMappingMode } from 'postprocessing';
import { isObservable, map } from 'rxjs';

@Directive({
  selector: 'ngt-tone-mapping-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtToneMappingEffect), provideCommonEffectRef(NgtToneMappingEffect)],
})
export class NgtToneMappingEffect extends NgtCommonEffect<ToneMappingEffect> {
  override get effectType(): NgtAnyConstructor<ToneMappingEffect> {
    return ToneMappingEffect;
  }

  @Input() set adaptive(adaptive: NgtObservableInput<NgtBooleanInput>) {
    this.set({ adaptive: isObservable(adaptive) ? adaptive.pipe(map(coerceBoolean)) : coerceBoolean(adaptive) });
  }

  @Input() set mode(mode: NgtObservableInput<ToneMappingMode>) {
    this.set({ mode });
  }

  @Input() set resolution(resolution: NgtObservableInput<NgtNumberInput>) {
    this.set({ resolution: isObservable(resolution) ? resolution.pipe(map(coerceNumber)) : coerceNumber(resolution) });
  }

  @Input() set maxLuminance(maxLuminance: NgtObservableInput<NgtNumberInput>) {
    this.set({
      maxLuminance: isObservable(maxLuminance) ? maxLuminance.pipe(map(coerceNumber)) : coerceNumber(maxLuminance),
    });
  }

  @Input() set whitePoint(whitePoint: NgtObservableInput<NgtNumberInput>) {
    this.set({ whitePoint: isObservable(whitePoint) ? whitePoint.pipe(map(coerceNumber)) : coerceNumber(whitePoint) });
  }

  @Input() set middleGrey(middleGrey: NgtObservableInput<NgtNumberInput>) {
    this.set({ middleGrey: isObservable(middleGrey) ? middleGrey.pipe(map(coerceNumber)) : coerceNumber(middleGrey) });
  }

  @Input() set minLuminance(minLuminance: NgtObservableInput<NgtNumberInput>) {
    this.set({
      minLuminance: isObservable(minLuminance) ? minLuminance.pipe(map(coerceNumber)) : coerceNumber(minLuminance),
    });
  }

  @Input() set averageLuminance(averageLuminance: NgtObservableInput<NgtNumberInput>) {
    this.set({
      averageLuminance: isObservable(averageLuminance)
        ? averageLuminance.pipe(map(coerceNumber))
        : coerceNumber(averageLuminance),
    });
  }

  @Input() set adaptationRate(adaptationRate: NgtObservableInput<NgtNumberInput>) {
    this.set({
      adaptationRate: isObservable(adaptationRate)
        ? adaptationRate.pipe(map(coerceNumber))
        : coerceNumber(adaptationRate),
    });
  }

  override get effectPropFields(): string[] {
    return [
      ...super.effectPropFields,
      'adaptive',
      'mode',
      'resolution',
      'maxLuminance',
      'whitePoint',
      'middleGrey',
      'minLuminance',
      'averageLuminance',
      'adaptationRate',
    ];
  }
}
