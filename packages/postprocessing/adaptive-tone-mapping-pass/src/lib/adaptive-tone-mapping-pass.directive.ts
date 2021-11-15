// GENERATED
import type {
  UnknownRecord,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass';

@Directive({
  selector: 'ngt-adaptive-tone-mapping-pass',
  exportAs: 'ngtAdaptiveToneMappingPass',
  providers: [{ provide: NgtPass, useExisting: NgtAdaptiveToneMappingPass }],
})
export class NgtAdaptiveToneMappingPass extends NgtPass<AdaptiveToneMappingPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof AdaptiveToneMappingPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof AdaptiveToneMappingPass>) {
    this.extraArgs = v;
  }
  
  @Input() needsInit?: number;
  @Input() luminanceRT?: THREE.WebGLRenderTarget;
  @Input() previousLuminanceRT?: THREE.WebGLRenderTarget;
  @Input() currentLuminanceRT?: THREE.WebGLRenderTarget;
  @Input() copyUniforms?: UnknownRecord;
  @Input() materialCopy?: THREE.ShaderMaterial;
  @Input() materialLuminance?: THREE.ShaderMaterial;
  @Input() adaptLuminanceShader?: UnknownRecord;
  @Input() materialAdaptiveLum?: THREE.ShaderMaterial;
  @Input() materialToneMap?: THREE.ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;

  passType = AdaptiveToneMappingPass;
  extraInputs = [
    'needsInit',
    'luminanceRT',
    'previousLuminanceRT',
    'currentLuminanceRT',
    'copyUniforms',
    'materialCopy',
    'materialLuminance',
    'adaptLuminanceShader',
    'materialAdaptiveLum',
    'materialToneMap',
    'fsQuad',
  ];
}
