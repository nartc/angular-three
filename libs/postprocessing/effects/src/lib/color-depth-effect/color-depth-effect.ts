// GENERATED
import { AnyConstructor, coerceNumberProperty, NumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { ColorDepthEffect } from 'postprocessing';

@Component({
  selector: 'ngt-color-depth-effect',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonEffectRef(NgtColorDepthEffect)],
})
export class NgtColorDepthEffect extends NgtCommonEffect<ColorDepthEffect> {
  override get effectType(): AnyConstructor<ColorDepthEffect> {
    return ColorDepthEffect;
  }

  @Input() set bits(bits: NumberInput) {
    this.set({ bits: coerceNumberProperty(bits) });
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      bits: true,
    };
  }
}

@NgModule({
  imports: [NgtColorDepthEffect],
  exports: [NgtColorDepthEffect],
})
export class NgtColorDepthEffectModule {}
