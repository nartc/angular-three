import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect, NgtpKeyofProps } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlendFunction, BloomEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-bloom',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound></ngt-primitive>`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtpBloom extends NgtpEffect<BloomEffect> {
  override get effectConstructor(): NgtAnyConstructor<BloomEffect> {
    return BloomEffect;
  }

  override get effectPropsKeys(): NgtpKeyofProps<BloomEffect> {
    return [
      'blendFunction',
      'mipmapBlur',
      'luminanceThreshold',
      'luminanceSmoothing',
      'intensity',
      'resolutionScale',
      'resolutionX',
      'resolutionY',
      'width',
      'height',
      'kernelSize',
    ];
  }

  override defaultBlendMode: BlendFunction = BlendFunction.ADD;
}
