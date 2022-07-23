// GENERATED
import { AnyConstructor, coerceNumberProperty, NumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideNgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { BrightnessContrastEffect } from 'postprocessing';

@Component({
  selector: 'ngt-brightness-contrast-effect',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonEffect(NgtBrightnessContrastEffect), provideCommonEffectRef(NgtBrightnessContrastEffect)],
})
export class NgtBrightnessContrastEffect extends NgtCommonEffect<BrightnessContrastEffect> {
  override get effectType(): AnyConstructor<BrightnessContrastEffect> {
    return BrightnessContrastEffect;
  }

  @Input() set brightness(brightness: NumberInput) {
    this.set({ brightness: coerceNumberProperty(brightness) });
  }

  @Input() set contrast(contrast: NumberInput) {
    this.set({ contrast: coerceNumberProperty(contrast) });
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      brightness: true,
      contrast: true,
    };
  }
}

@NgModule({
  imports: [NgtBrightnessContrastEffect],
  exports: [NgtBrightnessContrastEffect],
})
export class NgtBrightnessContrastEffectModule {}
