// GENERATED

import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import type { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass';
import type { Reflector } from 'three/examples/jsm/objects/ReflectorForSSRPass';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass';

@Directive({
  selector: 'ngt-ssrpass',
  exportAs: 'ngtSSRPass',
  providers: [{ provide: NgtPass, useExisting: NgtSSRPass }],
})
export class NgtSSRPass extends NgtPass<SSRPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SSRPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SSRPass>) {
    this.extraArgs = v;
  }
  
  @Input() width?: number;
  @Input() height?: number;
  @Input() clear?: boolean;
  @Input() renderer?: THREE.WebGLRenderer;
  @Input() scene?: THREE.Scene;
  @Input() camera?: THREE.Camera;
  @Input() groundReflector?: Reflector | null;
  @Input() opacity?: number;
  @Input() output?: number;
  @Input() maxDistance?: number;
  @Input() surfDist?: number;
  @Input() encoding?: THREE.TextureEncoding;
  @Input() tempColor?: THREE.Color;
  @Input() selective?: boolean;
  @Input() blur?: boolean;
  @Input() thickTolerance?: number;
  @Input() beautyRenderTarget?: THREE.WebGLRenderTarget;
  @Input() prevRenderTarget?: THREE.WebGLRenderTarget;
  @Input() normalRenderTarget?: THREE.WebGLRenderTarget;
  @Input() metalnessRenderTarget?: THREE.WebGLRenderTarget;
  @Input() ssrRenderTarget?: THREE.WebGLRenderTarget;
  @Input() blurRenderTarget?: THREE.WebGLRenderTarget;
  @Input() blurRenderTarget2?: THREE.WebGLRenderTarget;
  @Input() ssrMaterial?: THREE.ShaderMaterial;
  @Input() normalMaterial?: THREE.MeshNormalMaterial;
  @Input() metalnessOnMaterial?: THREE.MeshBasicMaterial;
  @Input() metalnessOffMaterial?: THREE.MeshBasicMaterial;
  @Input() blurMaterial?: THREE.ShaderMaterial;
  @Input() blurMaterial2?: THREE.ShaderMaterial;
  @Input() depthRenderMaterial?: THREE.ShaderMaterial;
  @Input() copyMaterial?: THREE.ShaderMaterial;
  @Input() fsQuad?: FullScreenQuad;
  @Input() originalClearColor?: THREE.Color;

  passType = SSRPass;
  extraInputs = [
    'width',
    'height',
    'clear',
    'renderer',
    'scene',
    'camera',
    'groundReflector',
    'opacity',
    'output',
    'maxDistance',
    'surfDist',
    'encoding',
    'tempColor',
    'selective',
    'blur',
    'thickTolerance',
    'beautyRenderTarget',
    'prevRenderTarget',
    'normalRenderTarget',
    'metalnessRenderTarget',
    'ssrRenderTarget',
    'blurRenderTarget',
    'blurRenderTarget2',
    'ssrMaterial',
    'normalMaterial',
    'metalnessOnMaterial',
    'metalnessOffMaterial',
    'blurMaterial',
    'blurMaterial2',
    'depthRenderMaterial',
    'copyMaterial',
    'fsQuad',
    'originalClearColor',
  ];
}
