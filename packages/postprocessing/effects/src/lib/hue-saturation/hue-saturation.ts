import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect, NgtpKeyofProps } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HueSaturationEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-hue-saturation',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound></ngt-primitive>`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtpHueSaturation extends NgtpEffect<HueSaturationEffect> {
  override get effectConstructor(): NgtAnyConstructor<HueSaturationEffect> {
    return HueSaturationEffect;
  }

  override get effectPropsKeys(): NgtpKeyofProps<HueSaturationEffect> {
    return ['blendFunction', 'hue', 'saturation'];
  }
}
