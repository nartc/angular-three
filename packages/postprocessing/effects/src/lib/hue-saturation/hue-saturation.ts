import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HueSaturationEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-hue-saturation',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound />`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  inputs: ['hue', 'saturation'],
})
export class NgtpHueSaturation extends NgtpEffect<HueSaturationEffect> {
  override get effectConstructor(): NgtAnyConstructor<HueSaturationEffect> {
    return HueSaturationEffect;
  }
}
