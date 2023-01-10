import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlendFunction, ScanlineEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-scanline',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound />`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  inputs: ['density'],
})
export class NgtpScanline extends NgtpEffect<ScanlineEffect> {
  override get effectConstructor(): NgtAnyConstructor<ScanlineEffect> {
    return ScanlineEffect;
  }

  override defaultBlendMode: BlendFunction = BlendFunction.OVERLAY;
}
