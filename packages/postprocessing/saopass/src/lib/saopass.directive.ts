// GENERATED

import type {
  WithoutSceneCameraConstructorParameters,
  UnknownRecord,
} from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type {
  Color,
  Vector2,
  WebGLRenderTarget,
  MeshDepthMaterial,
  MeshNormalMaterial,
  ShaderMaterial,
} from 'three';
import type { SAOPassParams } from 'three/examples/jsm/postprocessing/SAOPass';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass';

@Directive({
  selector: 'ngt-saopass',
  exportAs: 'ngtSAOPass',
  providers: [{ provide: ThreePass, useExisting: SAOPassDirective }],
})
export class SAOPassDirective extends ThreePass<SAOPass> {
  static ngAcceptInputType_args:
    | WithoutSceneCameraConstructorParameters<
        ConstructorParameters<typeof SAOPass>
      >
    | undefined;

  @Input() set args(
    v: WithoutSceneCameraConstructorParameters<
      ConstructorParameters<typeof SAOPass>
    >
  ) {
    this.extraArgs = v;
  }

  @Input() supportsDepthTextureExtension?: boolean;
  @Input() supportsNormalTexture?: boolean;
  @Input() originalClearColor?: Color;
  @Input() oldClearColor?: Color;
  @Input() oldClearAlpha?: number;
  @Input() resolution?: Vector2;
  @Input() saoRenderTarget?: WebGLRenderTarget;
  @Input() blurIntermediateRenderTarget?: WebGLRenderTarget;
  @Input() beautyRenderTarget?: WebGLRenderTarget;
  @Input() normalRenderTarget?: WebGLRenderTarget;
  @Input() depthRenderTarget?: WebGLRenderTarget;
  @Input() depthMaterial?: MeshDepthMaterial;
  @Input() normalMaterial?: MeshNormalMaterial;
  @Input() saoMaterial?: ShaderMaterial;
  @Input() vBlurMaterial?: ShaderMaterial;
  @Input() hBlurMaterial?: ShaderMaterial;
  @Input() materialCopy?: ShaderMaterial;
  @Input() depthCopy?: ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;
  @Input() params?: SAOPassParams;

  passType = SAOPass;
  extraInputs = [
    'supportsDepthTextureExtension',
    'supportsNormalTexture',
    'originalClearColor',
    'oldClearColor',
    'oldClearAlpha',
    'resolution',
    'saoRenderTarget',
    'blurIntermediateRenderTarget',
    'beautyRenderTarget',
    'normalRenderTarget',
    'depthRenderTarget',
    'depthMaterial',
    'normalMaterial',
    'saoMaterial',
    'vBlurMaterial',
    'hBlurMaterial',
    'materialCopy',
    'depthCopy',
    'fsQuad',
    'params',
  ];
  protected get useSceneAndCamera():
    | 'scene'
    | 'camera'
    | 'sceneAndCamera'
    | null {
    return 'sceneAndCamera';
  }
}
