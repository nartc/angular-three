import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ColorDepthEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-color-depth',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound></ngt-primitive>`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  inputs: ['bits'],
})
export class NgtpColorDepth extends NgtpEffect<ColorDepthEffect> {
  override get effectConstructor(): NgtAnyConstructor<ColorDepthEffect> {
    return ColorDepthEffect;
  }
}
