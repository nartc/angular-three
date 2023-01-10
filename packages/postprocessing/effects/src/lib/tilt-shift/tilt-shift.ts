import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlendFunction, TiltShiftEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-tilt-shift',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound />`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  inputs: [
    'offset',
    'rotation',
    'focusArea',
    'feather',
    'bias',
    'kernelSize',
    'resolutionScale',
    'resolutionX',
    'resolutionY',
  ],
})
export class NgtpTiltShift extends NgtpEffect<TiltShiftEffect> {
  override get effectConstructor(): NgtAnyConstructor<TiltShiftEffect> {
    return TiltShiftEffect;
  }

  override defaultBlendMode: BlendFunction = BlendFunction.ADD;
}
