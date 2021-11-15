// GENERATED

import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import type { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass';
import { SSRrPass } from 'three/examples/jsm/postprocessing/SSRrPass';

@Directive({
  selector: 'ngt-ssrr-pass',
  exportAs: 'ngtSSRrPass',
  providers: [{ provide: NgtPass, useExisting: NgtSSRrPass }],
})
export class NgtSSRrPass extends NgtPass<SSRrPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SSRrPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SSRrPass>) {
    this.extraArgs = v;
  }

  @Input() width?: number;
  @Input() height?: number;
  @Input() clear?: boolean;
  @Input() renderer?: THREE.WebGLRenderer;
  @Input() scene?: THREE.Scene;
  @Input() camera?: THREE.Camera;
  @Input() output?: number;
  @Input() ior?: number;
  @Input() maxDistance?: number;
  @Input() surfDist?: number;
  @Input() encoding?: THREE.TextureEncoding;
  @Input() color?: THREE.Color;
  @Input() selects?: null | THREE.Mesh[];
  @Input() specular?: boolean;
  @Input() fillHole?: boolean;
  @Input() infiniteThick?: boolean;
  @Input() beautyRenderTarget?: THREE.WebGLRenderTarget;
  @Input() specularRenderTarget?: THREE.WebGLRenderTarget;
  @Input() normalSelectsRenderTarget?: THREE.WebGLRenderTarget;
  @Input() refractiveRenderTarget?: THREE.WebGLRenderTarget;
  @Input() ssrrRenderTarget?: THREE.WebGLRenderTarget;
  @Input() ssrrMaterial?: THREE.ShaderMaterial;
  @Input() normalMaterial?: THREE.MeshNormalMaterial;
  @Input() refractiveOnMaterial?: THREE.MeshBasicMaterial;
  @Input() refractiveOffMaterial?: THREE.MeshBasicMaterial;
  @Input() specularMaterial?: THREE.MeshStandardMaterial;
  @Input() depthRenderMaterial?: THREE.ShaderMaterial;
  @Input() copyMaterial?: THREE.ShaderMaterial;
  @Input() fsQuad?: FullScreenQuad;
  @Input() originalClearColor?: THREE.Color;

  passType = SSRrPass;
  extraInputs = [
    'width',
    'height',
    'clear',
    'renderer',
    'scene',
    'camera',
    'output',
    'ior',
    'maxDistance',
    'surfDist',
    'encoding',
    'color',
    'selects',
    'specular',
    'fillHole',
    'infiniteThick',
    'beautyRenderTarget',
    'specularRenderTarget',
    'normalSelectsRenderTarget',
    'refractiveRenderTarget',
    'ssrrRenderTarget',
    'ssrrMaterial',
    'normalMaterial',
    'refractiveOnMaterial',
    'refractiveOffMaterial',
    'specularMaterial',
    'depthRenderMaterial',
    'copyMaterial',
    'fsQuad',
    'originalClearColor',
  ];
}
