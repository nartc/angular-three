// GENERATED
import type {
  NgtColor,
  UnknownRecord,
  LessFirstTwoConstructorParameters,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass';

@Directive({
  selector: 'ngt-taarender-pass',
  exportAs: 'ngtTAARenderPass',
  providers: [{ provide: NgtPass, useExisting: NgtTAARenderPass }],
})
export class NgtTAARenderPass extends NgtPass<TAARenderPass> {
  static ngAcceptInputType_args:
    | LessFirstTwoConstructorParameters<
        ConstructorParameters<typeof TAARenderPass>
      >
    | undefined;

  @Input() set args(
    v: LessFirstTwoConstructorParameters<
      ConstructorParameters<typeof TAARenderPass>
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
  @Input() accumulate?: boolean;

  passType = TAARenderPass;
  extraInputs = [
    'sampleLevel',
    'unbiased',
    'clearColor',
    'clearAlpha',
    'copyUniforms',
    'copyMaterial',
    'fsQuad',
    'sampleRenderTarget',
    'accumulate',
  ];
  protected get useSceneAndCamera():
    | 'scene'
    | 'camera'
    | 'sceneAndCamera'
    | null {
    return 'sceneAndCamera';
  }
}
