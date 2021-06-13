// GENERATED

import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type {
  WebGLRenderer,
  Scene,
  Camera,
  TextureEncoding,
  Color,
  WebGLRenderTarget,
  ShaderMaterial,
  MeshNormalMaterial,
  MeshBasicMaterial,
} from 'three';
import type { FullScreenQuad } from 'three/examples/jsm/postprocessing/Pass';
import type { Reflector } from 'three/examples/jsm/objects/ReflectorForSSRPass';
import { SSRPass } from 'three/examples/jsm/postprocessing/SSRPass';

@Directive({
  selector: 'ngt-ssrpass',
  exportAs: 'ngtSSRPass',
  providers: [{ provide: ThreePass, useExisting: SSRPassDirective }],
})
export class SSRPassDirective extends ThreePass<SSRPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SSRPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SSRPass>) {
    this.extraArgs = v;
  }

  @Input() width?: number;
  @Input() height?: number;
  @Input() clear?: boolean;
  @Input() renderer?: WebGLRenderer;
  @Input() scene?: Scene;
  @Input() camera?: Camera;
  @Input() groundReflector?: Reflector | null;
  @Input() opacity?: number;
  @Input() output?: number;
  @Input() maxDistance?: number;
  @Input() surfDist?: number;
  @Input() encoding?: TextureEncoding;
  @Input() tempColor?: Color;
  @Input() selective?: boolean;
  @Input() blur?: boolean;
  @Input() thickTolerance?: number;
  @Input() beautyRenderTarget?: WebGLRenderTarget;
  @Input() prevRenderTarget?: WebGLRenderTarget;
  @Input() normalRenderTarget?: WebGLRenderTarget;
  @Input() metalnessRenderTarget?: WebGLRenderTarget;
  @Input() ssrRenderTarget?: WebGLRenderTarget;
  @Input() blurRenderTarget?: WebGLRenderTarget;
  @Input() blurRenderTarget2?: WebGLRenderTarget;
  @Input() ssrMaterial?: ShaderMaterial;
  @Input() normalMaterial?: MeshNormalMaterial;
  @Input() metalnessOnMaterial?: MeshBasicMaterial;
  @Input() metalnessOffMaterial?: MeshBasicMaterial;
  @Input() blurMaterial?: ShaderMaterial;
  @Input() blurMaterial2?: ShaderMaterial;
  @Input() depthRenderMaterial?: ShaderMaterial;
  @Input() copyMaterial?: ShaderMaterial;
  @Input() fsQuad?: FullScreenQuad;
  @Input() originalClearColor?: Color;

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
