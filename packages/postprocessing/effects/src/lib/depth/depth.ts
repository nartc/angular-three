import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DepthEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-depth',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound />`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  inputs: ['inverted'],
})
export class NgtpDepth extends NgtpEffect<DepthEffect> {
  override get effectConstructor(): NgtAnyConstructor<DepthEffect> {
    return DepthEffect;
  }
}
