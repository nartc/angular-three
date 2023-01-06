import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect, NgtpKeyofProps } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SepiaEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-sepia',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound></ngt-primitive>`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtpSepia extends NgtpEffect<SepiaEffect> {
  override get effectConstructor(): NgtAnyConstructor<SepiaEffect> {
    return SepiaEffect;
  }

  override get effectPropsKeys(): NgtpKeyofProps<SepiaEffect> {
    return ['blendFunction', 'intensity'];
  }
}
