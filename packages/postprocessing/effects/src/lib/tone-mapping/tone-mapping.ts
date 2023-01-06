import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect, NgtpKeyofProps } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToneMappingEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-tone-mapping',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound></ngt-primitive>`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtpToneMapping extends NgtpEffect<ToneMappingEffect> {
  override get effectConstructor(): NgtAnyConstructor<ToneMappingEffect> {
    return ToneMappingEffect;
  }

  override get effectPropsKeys(): NgtpKeyofProps<ToneMappingEffect> {
    return [
      'blendFunction',
      'adaptive',
      'mode',
      'resolution',
      'maxLuminance',
      'whitePoint',
      'middleGrey',
      'minLuminance',
      'averageLuminance',
      'adaptationRate',
    ];
  }
}
