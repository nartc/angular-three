import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ToneMappingEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-tone-mapping',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound />`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  inputs: [
    'adaptive',
    'mode',
    'resolution',
    'maxLuminance',
    'whitePoint',
    'middleGrey',
    'minLuminance',
    'averageLuminance',
    'adaptationRate',
  ],
})
export class NgtpToneMapping extends NgtpEffect<ToneMappingEffect> {
  override get effectConstructor(): NgtAnyConstructor<ToneMappingEffect> {
    return ToneMappingEffect;
  }
}
