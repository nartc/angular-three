// GENERATED

import type {
  ThreeColor,
  UnknownRecord,
  WithoutSceneCameraConstructorParameters,
} from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type { ShaderMaterial, WebGLRenderTarget } from 'three';
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass';

@Directive({
  selector: 'ngt-taarender-pass',
  exportAs: 'ngtTAARenderPass',
  providers: [{ provide: ThreePass, useExisting: TAARenderPassDirective }],
})
export class TAARenderPassDirective extends ThreePass<TAARenderPass> {
  static ngAcceptInputType_args:
    | WithoutSceneCameraConstructorParameters<
        ConstructorParameters<typeof TAARenderPass>
      >
    | undefined;

  @Input() set args(
    v: WithoutSceneCameraConstructorParameters<
      ConstructorParameters<typeof TAARenderPass>
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
