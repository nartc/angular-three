// GENERATED
import type {
  UnknownRecord,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';

@Directive({
  selector: 'ngt-bloom-pass',
  exportAs: 'ngtBloomPass',
  providers: [{ provide: NgtPass, useExisting: NgtBloomPass }],
})
export class NgtBloomPass extends NgtPass<BloomPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof BloomPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof BloomPass>) {
    this.extraArgs = v;
  }
  
  @Input() renderTargetX?: THREE.WebGLRenderTarget;
  @Input() renderTargetY?: THREE.WebGLRenderTarget;
  @Input() copyUniforms?: UnknownRecord;
  @Input() materialCopy?: THREE.ShaderMaterial;
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
