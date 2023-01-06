import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect, NgtpKeyofProps } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DepthEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-depth',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound></ngt-primitive>`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtpDepth extends NgtpEffect<DepthEffect> {
  override get effectConstructor(): NgtAnyConstructor<DepthEffect> {
    return DepthEffect;
  }

  override get effectPropsKeys(): NgtpKeyofProps<DepthEffect> {
    return ['blendFunction', 'inverted'];
  }
}
