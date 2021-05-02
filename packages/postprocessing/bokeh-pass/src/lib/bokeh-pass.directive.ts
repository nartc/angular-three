// GENERATED

import type {
  UnknownRecord,
  WithoutSceneCameraConstructorParameters,
} from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type {
  WebGLRenderTarget,
  ShaderMaterial,
  MeshDepthMaterial,
  Color,
} from 'three';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass';

@Directive({
  selector: 'ngt-bokeh-pass',
  exportAs: 'ngtBokehPass',
  providers: [{ provide: ThreePass, useExisting: BokehPassDirective }],
})
export class BokehPassDirective extends ThreePass<BokehPass> {
  static ngAcceptInputType_args:
    | WithoutSceneCameraConstructorParameters<
        ConstructorParameters<typeof BokehPass>
      >
    | undefined;

  @Input() set args(
    v: WithoutSceneCameraConstructorParameters<
      ConstructorParameters<typeof BokehPass>
    >
  ) {
    this.extraArgs = v;
  }

  @Input() renderTargetColor?: WebGLRenderTarget;
  @Input() renderTargetDepth?: WebGLRenderTarget;
  @Input() materialDepth?: MeshDepthMaterial;
  @Input() materialBokeh?: ShaderMaterial;
  @Input() uniforms?: UnknownRecord;
  @Input() fsQuad?: UnknownRecord;
  @Input() oldClearColor?: Color;

  passType = BokehPass;
  extraInputs = [
    'renderTargetColor',
    'renderTargetDepth',
    'materialDepth',
    'materialBokeh',
    'uniforms',
    'fsQuad',
    'oldClearColor',
  ];
  protected get useSceneAndCamera():
    | 'scene'
    | 'camera'
    | 'sceneAndCamera'
    | null {
    return 'sceneAndCamera';
  }
}
