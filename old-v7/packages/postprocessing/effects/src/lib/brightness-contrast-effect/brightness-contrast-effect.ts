// GENERATED - AngularThree v7.0.0
import { NgtAnyConstructor, NgtObservableInput, coerceNumber, NgtNumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef, provideNgtCommonEffect } from '@angular-three/postprocessing';
import { isObservable, map } from 'rxjs';
import { Directive, Input } from '@angular/core';
import { BrightnessContrastEffect } from 'postprocessing';

@Directive({
  selector: 'ngt-brightness-contrast-effect',
  standalone: true,
  providers: [provideNgtCommonEffect(NgtBrightnessContrastEffect), provideCommonEffectRef(NgtBrightnessContrastEffect)],
})
export class NgtBrightnessContrastEffect extends NgtCommonEffect<BrightnessContrastEffect> {
  override get effectType(): NgtAnyConstructor<BrightnessContrastEffect> {
    return BrightnessContrastEffect;
  }

  @Input() set brightness(brightness: NgtObservableInput<NgtNumberInput>) {
    this.set({ brightness: isObservable(brightness) ? brightness.pipe(map(coerceNumber)) : coerceNumber(brightness) });
  }

  @Input() set contrast(contrast: NgtObservableInput<NgtNumberInput>) {
    this.set({ contrast: isObservable(contrast) ? contrast.pipe(map(coerceNumber)) : coerceNumber(contrast) });
  }

  override get effectPropFields(): string[] {
    return [...super.effectPropFields, 'brightness', 'contrast'];
  }
}
