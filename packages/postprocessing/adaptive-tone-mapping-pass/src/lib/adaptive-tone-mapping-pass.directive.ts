// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { WebGLRenderTarget, ShaderMaterial } from 'three';
import { AdaptiveToneMappingPass } from 'three/examples/jsm/postprocessing/AdaptiveToneMappingPass';

@Directive({
  selector: 'ngt-adaptive-tone-mapping-pass',
  exportAs: 'ngtAdaptiveToneMappingPass',
  providers: [
    { provide: ThreePass, useExisting: AdaptiveToneMappingPassDirective },
  ],
})
export class AdaptiveToneMappingPassDirective extends ThreePass<AdaptiveToneMappingPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof AdaptiveToneMappingPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof AdaptiveToneMappingPass>) {
    this.extraArgs = v;
  }

  @Input() needsInit?: number;
  @Input() luminanceRT?: WebGLRenderTarget;
  @Input() previousLuminanceRT?: WebGLRenderTarget;
  @Input() currentLuminanceRT?: WebGLRenderTarget;
  @Input() copyUniforms?: UnknownRecord;
  @Input() materialCopy?: ShaderMaterial;
  @Input() materialLuminance?: ShaderMaterial;
  @Input() adaptLuminanceShader?: UnknownRecord;
  @Input() materialAdaptiveLum?: ShaderMaterial;
  @Input() materialToneMap?: ShaderMaterial;
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
