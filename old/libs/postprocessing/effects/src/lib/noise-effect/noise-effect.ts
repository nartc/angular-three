// GENERATED
import { AnyConstructor, coerceBooleanProperty, BooleanInput } from '@angular-three/core';
import { NgtCommonEffect, provideNgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { BlendFunction, NoiseEffect } from 'postprocessing';

@Component({
  selector: 'ngt-noise-effect',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonEffect(NgtNoiseEffect), provideCommonEffectRef(NgtNoiseEffect)],
})
export class NgtNoiseEffect extends NgtCommonEffect<NoiseEffect> {
  override get effectType(): AnyConstructor<NoiseEffect> {
    return NoiseEffect;
  }

  @Input() set premultiply(premultiply: BooleanInput) {
    this.set({ premultiply: coerceBooleanProperty(premultiply) });
  }

  protected override get defaultBlendMode(): BlendFunction {
    return BlendFunction.COLOR_DODGE;
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      premultiply: true,
    };
  }
}

@NgModule({
  imports: [NgtNoiseEffect],
  exports: [NgtNoiseEffect],
})
export class NgtNoiseEffectModule {}
