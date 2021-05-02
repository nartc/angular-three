// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { WebGLRenderTarget, ShaderMaterial } from 'three';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';

@Directive({
  selector: 'ngt-bloom-pass',
  exportAs: 'ngtBloomPass',
  providers: [{ provide: ThreePass, useExisting: BloomPassDirective }],
})
export class BloomPassDirective extends ThreePass<BloomPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof BloomPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof BloomPass>) {
    this.extraArgs = v;
  }

  @Input() renderTargetX?: WebGLRenderTarget;
  @Input() renderTargetY?: WebGLRenderTarget;
  @Input() copyUniforms?: UnknownRecord;
  @Input() materialCopy?: ShaderMaterial;
  @Input() convolutionUniforms?: UnknownRecord;
  @Input() materialConvolution?: UnknownRecord;
  @Input() fsQuad?: UnknownRecord;

  passType = BloomPass;
  extraInputs = [
    'renderTargetX',
    'renderTargetY',
    'copyUniforms',
    'materialCopy',
    'convolutionUniforms',
    'materialConvolution',
    'fsQuad',
  ];
}
