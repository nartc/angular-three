// GENERATED
import { AnyConstructor, coerceNumberProperty, NumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { SepiaEffect } from 'postprocessing';

@Component({
  selector: 'ngt-sepia-effect',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonEffectRef(NgtSepiaEffect)],
})
export class NgtSepiaEffect extends NgtCommonEffect<SepiaEffect> {
  override get effectType(): AnyConstructor<SepiaEffect> {
    return SepiaEffect;
  }

  @Input() set intensity(intensity: NumberInput) {
    this.set({ intensity: coerceNumberProperty(intensity) });
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      intensity: true,
    };
  }
}

@NgModule({
  imports: [NgtSepiaEffect],
  exports: [NgtSepiaEffect],
})
export class NgtSepiaEffectModule {}
