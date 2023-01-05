import { NgtAnyConstructor, NgtArgs } from '@angular-three/core';
import { NgtpEffect, NgtpKeyofProps } from '@angular-three/postprocessing';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BlendFunction, ScanlineEffect } from 'postprocessing';

@Component({
  selector: 'ngtp-scanline',
  standalone: true,
  template: `<ngt-primitive *args="[get('effect')]" ngtCompound></ngt-primitive>`,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtpScanline extends NgtpEffect<ScanlineEffect> {
  override get effectConstructor(): NgtAnyConstructor<ScanlineEffect> {
    return ScanlineEffect;
  }

  override get effectPropsKeys(): NgtpKeyofProps<ScanlineEffect> {
    return ['blendFunction', 'density'];
  }

  override defaultBlendMode: BlendFunction = BlendFunction.OVERLAY;
}
