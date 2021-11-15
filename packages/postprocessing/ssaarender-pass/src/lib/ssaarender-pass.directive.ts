// GENERATED
import type {
  NgtColor,
  UnknownRecord,
  LessFirstTwoConstructorParameters,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass';

@Directive({
  selector: 'ngt-ssaarender-pass',
  exportAs: 'ngtSSAARenderPass',
  providers: [{ provide: NgtPass, useExisting: NgtSSAARenderPass }],
})
export class NgtSSAARenderPass extends NgtPass<SSAARenderPass> {
  static ngAcceptInputType_args:
    | LessFirstTwoConstructorParameters<
        ConstructorParameters<typeof SSAARenderPass>
      >
    | undefined;

  @Input() set args(
    v: LessFirstTwoConstructorParameters<
      ConstructorParameters<typeof SSAARenderPass>
    >
  ) {
    this.extraArgs = v;
  }

  @Input() sampleLevel?: number;
  @Input() unbiased?: boolean;
  @Input() clearColor?: NgtColor;
  @Input() clearAlpha?: number;
  @Input() copyUniforms?: UnknownRecord;
  @Input() copyMaterial?: THREE.ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;
  @Input() sampleRenderTarget?: THREE.WebGLRenderTarget;

  passType = SSAARenderPass;
  extraInputs = [
    'sampleLevel',
    'unbiased',
    'clearColor',
    'clearAlpha',
    'copyUniforms',
    'copyMaterial',
    'fsQuad',
    'sampleRenderTarget',
  ];
  protected get useSceneAndCamera():
    | 'scene'
    | 'camera'
    | 'sceneAndCamera'
    | null {
    return 'sceneAndCamera';
  }
}
