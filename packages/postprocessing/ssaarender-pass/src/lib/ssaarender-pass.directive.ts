// GENERATED

import type {
  ThreeColor,
  UnknownRecord,
  WithoutSceneCameraConstructorParameters,
} from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { ShaderMaterial, WebGLRenderTarget } from 'three';
import { SSAARenderPass } from 'three/examples/jsm/postprocessing/SSAARenderPass';

@Directive({
  selector: 'ngt-ssaarender-pass',
  exportAs: 'ngtSSAARenderPass',
  providers: [{ provide: ThreePass, useExisting: SSAARenderPassDirective }],
})
export class SSAARenderPassDirective extends ThreePass<SSAARenderPass> {
  static ngAcceptInputType_args:
    | WithoutSceneCameraConstructorParameters<
        ConstructorParameters<typeof SSAARenderPass>
      >
    | undefined;

  @Input() set args(
    v: WithoutSceneCameraConstructorParameters<
      ConstructorParameters<typeof SSAARenderPass>
    >
  ) {
    this.extraArgs = v;
  }

  @Input() sampleLevel?: number;
  @Input() unbiased?: boolean;
  @Input() clearColor?: ThreeColor;
  @Input() clearAlpha?: number;
  @Input() copyUniforms?: UnknownRecord;
  @Input() copyMaterial?: ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;
  @Input() sampleRenderTarget?: WebGLRenderTarget;

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
