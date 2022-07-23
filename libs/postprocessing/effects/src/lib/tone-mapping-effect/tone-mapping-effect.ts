// GENERATED
import {
  AnyConstructor,
  coerceBooleanProperty,
  BooleanInput,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { NgtCommonEffect, provideNgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { ToneMappingEffect, ToneMappingMode } from 'postprocessing';

@Component({
  selector: 'ngt-tone-mapping-effect',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonEffect(NgtToneMappingEffect), provideCommonEffectRef(NgtToneMappingEffect)],
})
export class NgtToneMappingEffect extends NgtCommonEffect<ToneMappingEffect> {
  override get effectType(): AnyConstructor<ToneMappingEffect> {
    return ToneMappingEffect;
  }

  @Input() set adaptive(adaptive: BooleanInput) {
    this.set({ adaptive: coerceBooleanProperty(adaptive) });
  }

  @Input() set mode(mode: ToneMappingMode) {
    this.set({ mode });
  }

  @Input() set resolution(resolution: NumberInput) {
    this.set({ resolution: coerceNumberProperty(resolution) });
  }

  @Input() set maxLuminance(maxLuminance: NumberInput) {
    this.set({ maxLuminance: coerceNumberProperty(maxLuminance) });
  }

  @Input() set whitePoint(whitePoint: NumberInput) {
    this.set({ whitePoint: coerceNumberProperty(whitePoint) });
  }

  @Input() set middleGrey(middleGrey: NumberInput) {
    this.set({ middleGrey: coerceNumberProperty(middleGrey) });
  }

  @Input() set minLuminance(minLuminance: NumberInput) {
    this.set({ minLuminance: coerceNumberProperty(minLuminance) });
  }

  @Input() set averageLuminance(averageLuminance: NumberInput) {
    this.set({ averageLuminance: coerceNumberProperty(averageLuminance) });
  }

  @Input() set adaptationRate(adaptationRate: NumberInput) {
    this.set({ adaptationRate: coerceNumberProperty(adaptationRate) });
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      adaptive: true,
      mode: true,
      resolution: true,
      maxLuminance: true,
      whitePoint: true,
      middleGrey: true,
      minLuminance: true,
      averageLuminance: true,
      adaptationRate: true,
    };
  }
}

@NgModule({
  imports: [NgtToneMappingEffect],
  exports: [NgtToneMappingEffect],
})
export class NgtToneMappingEffectModule {}
