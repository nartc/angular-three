// GENERATED
import type {
  LessFirstTwoConstructorParameters,
  UnknownRecord,
} from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import type { SSAOPassOUTPUT } from 'three/examples/jsm/postprocessing/SSAOPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';

@Directive({
  selector: 'ngt-ssaopass',
  exportAs: 'ngtSSAOPass',
  providers: [{ provide: NgtPass, useExisting: NgtSSAOPass }],
})
export class NgtSSAOPass extends NgtPass<SSAOPass> {
  static ngAcceptInputType_args:
    | LessFirstTwoConstructorParameters<ConstructorParameters<typeof SSAOPass>>
    | undefined;

  @Input() set args(
    v: LessFirstTwoConstructorParameters<ConstructorParameters<typeof SSAOPass>>
  ) {
    this.extraArgs = v;
  }

  @Input() clear?: boolean;
  @Input() kernelRadius?: number;
  @Input() kernelSize?: number;
  @Input() kernel?: THREE.Vector3[];
  @Input() noiseTexture?: THREE.DataTexture;
  @Input() output?: SSAOPassOUTPUT;
  @Input() minDistance?: number;
  @Input() maxDistance?: number;
  @Input() beautyRenderTarget?: THREE.WebGLRenderTarget;
  @Input() normalRenderTarget?: THREE.WebGLRenderTarget;
  @Input() ssaoRenderTarget?: THREE.WebGLRenderTarget;
  @Input() blurRenderTarget?: THREE.WebGLRenderTarget;
  @Input() ssaoMaterial?: THREE.ShaderMaterial;
  @Input() normalMaterial?: THREE.MeshNormalMaterial;
  @Input() blurMaterial?: THREE.ShaderMaterial;
  @Input() depthRenderMaterial?: THREE.ShaderMaterial;
  @Input() copyMaterial?: THREE.ShaderMaterial;
  @Input() fsQuad?: UnknownRecord;
  @Input() originalClearColor?: THREE.Color;

  passType = SSAOPass;
  extraInputs = [
    'clear',
    'kernelRadius',
    'kernelSize',
    'kernel',
    'noiseTexture',
    'output',
    'minDistance',
    'maxDistance',
    'beautyRenderTarget',
    'normalRenderTarget',
    'ssaoRenderTarget',
    'blurRenderTarget',
    'ssaoMaterial',
    'normalMaterial',
    'blurMaterial',
    'depthRenderMaterial',
    'copyMaterial',
    'fsQuad',
    'originalClearColor',
  ];
  protected get useSceneAndCamera():
    | 'scene'
    | 'camera'
    | 'sceneAndCamera'
    | null {
    return 'sceneAndCamera';
  }
}
