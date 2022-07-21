// GENERATED
import { AnyConstructor, coerceNumberProperty, NumberInput } from '@angular-three/core';
import { NgtCommonEffect, provideCommonEffectRef } from '@angular-three/postprocessing';
import { ChangeDetectionStrategy, Component, NgModule, Input } from '@angular/core';
import { HueSaturationEffect } from 'postprocessing';

@Component({
  selector: 'ngt-hue-saturation-effect',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonEffectRef(NgtHueSaturationEffect)],
})
export class NgtHueSaturationEffect extends NgtCommonEffect<HueSaturationEffect> {
  override get effectType(): AnyConstructor<HueSaturationEffect> {
    return HueSaturationEffect;
  }

  @Input() set hue(hue: NumberInput) {
    this.set({ hue: coerceNumberProperty(hue) });
  }

  @Input() set saturation(saturation: NumberInput) {
    this.set({ saturation: coerceNumberProperty(saturation) });
  }

  protected override get effectOptionsFields(): Record<string, boolean> {
    return {
      ...super.effectOptionsFields,
      hue: true,
      saturation: true,
    };
  }
}

@NgModule({
  imports: [NgtHueSaturationEffect],
  exports: [NgtHueSaturationEffect],
})
export class NgtHueSaturationEffectModule {}
