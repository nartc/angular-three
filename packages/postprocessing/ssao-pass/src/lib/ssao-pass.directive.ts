import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type {
  Color,
  DataTexture,
  MeshNormalMaterial,
  ShaderMaterial,
  Vector3,
  WebGLRenderTarget,
} from 'three';
import type { SSAOPassOUTPUT } from 'three/examples/jsm/postprocessing/SSAOPass';
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass';

@Directive({
  selector: 'ngt-sSAOPass',
  exportAs: 'ngtSSAOPass',
  providers: [{ provide: ThreePass, useExisting: SsaoPassDirective }],
})
export class SsaoPassDirective extends ThreePass<SSAOPass> {
  @Input() set args(v: ConstructorParameters<typeof SSAOPass>) {
    this.extraArgs = v;
  }

  @Input() clear?: boolean;
  @Input() kernelRadius?: number;
  @Input() kernelSize?: number;
  @Input() kernel?: Vector3[];
  @Input() noiseTexture?: DataTexture;
  @Input() output?: SSAOPassOUTPUT;
  @Input() minDistance?: number;
  @Input() maxDistance?: number;
  @Input() beautyRenderTarget?: WebGLRenderTarget;
  @Input() normalRenderTarget?: WebGLRenderTarget;
  @Input() ssaoRenderTarget?: WebGLRenderTarget;
  @Input() blurRenderTarget?: WebGLRenderTarget;
  @Input() ssaoMaterial?: ShaderMaterial;
  @Input() normalMaterial?: MeshNormalMaterial;
  @Input() blurMaterial?: ShaderMaterial;
  @Input() depthRenderMaterial?: ShaderMaterial;
  @Input() copyMaterial?: ShaderMaterial;
  @Input() fsQuad?: object;
  @Input() originalClearColor?: Color;

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

  protected get useSceneAndCamera(): boolean {
    return true;
  }
}
