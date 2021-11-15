// GENERATED
import type {
  LessFirstTwoConstructorParameters,
  UnknownRecord,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import type { SAOPassParams } from 'three/examples/jsm/postprocessing/SAOPass';
import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass';

@Directive({
  selector: 'ngt-saopass',
  exportAs: 'ngtSAOPass',
  providers: [{ provide: NgtPass, useExisting: NgtSAOPass }],
})
export class NgtSAOPass extends NgtPass<SAOPass> {
  static ngAcceptInputType_args:
    | LessFirstTwoConstructorParameters<ConstructorParameters<typeof SAOPass>>
    | undefined;

  @Input() set args(
    v: LessFirstTwoConstructorParameters<ConstructorParameters<typeof SAOPass>>
  ) {
    this.extraArgs = v;
  }

  @Input() supportsDepthTextureExtension?: boolean;
  @Input() supportsNormalTexture?: boolean;
  @Input() originalClearColor?: THREE.Color;
  @Input() oldClearColor?: THREE.Color;
  @Input() oldClearAlpha?: number;
  @Input() resolution?: THREE.Vector2;
  @Input() saoRenderTarget?: THREE.WebGLRenderTarget;
  @Input() blurIntermediateRenderTarget?: THREE.WebGLRenderTarget;
  @Input() beautyRenderTarget?: THREE.WebGLRenderTarget;
  @Input() normalRenderTarget?: THREE.WebGLRenderTarget;
  @Input() depthRenderTarget?: THREE.WebGLRenderTarget;
  @Input() depthMaterial?: THREE.MeshDepthMaterial;
  @Input() normalMaterial?: THREE.MeshNormalMaterial;
  @Input() saoMaterial?: THREE.ShaderMaterial;
  @Input() vBlurMaterial?: THREE.ShaderMaterial;
  @Input() hBlurMaterial?: THREE.ShaderMaterial;
  @Input() materialCopy?: THREE.ShaderMaterial;
  @Input() depthCopy?: THREE.ShaderMaterial;
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
