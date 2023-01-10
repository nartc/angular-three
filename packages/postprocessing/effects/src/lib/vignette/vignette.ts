import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { VignetteEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-vignette',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound />`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  inputs: ['technique', 'eskil', 'offset', 'darkness'],
})
export class NgtpVignette extends NgtpEffect<VignetteEffect> {
  override get effectConstructor(): NgtAnyConstructor<VignetteEffect> {
    return VignetteEffect;
  }
}
