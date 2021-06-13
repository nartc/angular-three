// GENERATED

import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type {
  WebGLRenderer,
  Scene,
  Camera,
  TextureEncoding,
  Color,
  Mesh,
  WebGLRenderTarget,
  ShaderMaterial,
  MeshNormalMaterial,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from 'three';
import type { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass';
import { SSRrPass } from 'three/examples/jsm/postprocessing/SSRrPass';

@Directive({
  selector: 'ngt-ssrr-pass',
  exportAs: 'ngtSSRrPass',
  providers: [{ provide: ThreePass, useExisting: SSRrPassDirective }],
})
export class SSRrPassDirective extends ThreePass<SSRrPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SSRrPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SSRrPass>) {
    this.extraArgs = v;
  }

  @Input() width?: number;
  @Input() height?: number;
  @Input() clear?: boolean;
  @Input() renderer?: WebGLRenderer;
  @Input() scene?: Scene;
  @Input() camera?: Camera;
  @Input() output?: number;
  @Input() ior?: number;
  @Input() maxDistance?: number;
  @Input() surfDist?: number;
  @Input() encoding?: TextureEncoding;
  @Input() color?: Color;
  @Input() selects?: null | Mesh[];
  @Input() specular?: boolean;
  @Input() fillHole?: boolean;
  @Input() infiniteThick?: boolean;
  @Input() beautyRenderTarget?: WebGLRenderTarget;
  @Input() specularRenderTarget?: WebGLRenderTarget;
  @Input() normalSelectsRenderTarget?: WebGLRenderTarget;
  @Input() refractiveRenderTarget?: WebGLRenderTarget;
  @Input() ssrrRenderTarget?: WebGLRenderTarget;
  @Input() ssrrMaterial?: ShaderMaterial;
  @Input() normalMaterial?: MeshNormalMaterial;
  @Input() refractiveOnMaterial?: MeshBasicMaterial;
  @Input() refractiveOffMaterial?: MeshBasicMaterial;
  @Input() specularMaterial?: MeshStandardMaterial;
  @Input() depthRenderMaterial?: ShaderMaterial;
  @Input() copyMaterial?: ShaderMaterial;
  @Input() fsQuad?: FullScreenQuad;
  @Input() originalClearColor?: Color;

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
