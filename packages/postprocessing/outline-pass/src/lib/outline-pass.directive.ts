// GENERATED

import type { UnknownRecord } from '@angular-three/core';
import { ThreePass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import type {
  Scene,
  Camera,
  Object3D,
  Color,
  Vector2,
  Texture,
  MeshBasicMaterial,
  WebGLRenderTarget,
  MeshDepthMaterial,
  ShaderMaterial,
  Matrix4,
} from 'three';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

@Directive({
  selector: 'ngt-outline-pass',
  exportAs: 'ngtOutlinePass',
  providers: [{ provide: ThreePass, useExisting: OutlinePassDirective }],
})
export class OutlinePassDirective extends ThreePass<OutlinePass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof OutlinePass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof OutlinePass>) {
    this.extraArgs = v;
  }

  @Input() renderScene?: Scene;
  @Input() renderCamera?: Camera;
  @Input() selectedObjects?: Object3D[];
  @Input() visibleEdgeColor?: Color;
  @Input() hiddenEdgeColor?: Color;
  @Input() edgeGlow?: number;
  @Input() usePatternTexture?: boolean;
  @Input() edgeThickness?: number;
  @Input() edgeStrength?: number;
  @Input() downSampleRatio?: number;
  @Input() pulsePeriod?: number;
  @Input() resolution?: Vector2;
  @Input() patternTexture?: Texture;
  @Input() maskBufferMaterial?: MeshBasicMaterial;
  @Input() renderTargetMaskBuffer?: WebGLRenderTarget;
  @Input() depthMaterial?: MeshDepthMaterial;
  @Input() prepareMaskMaterial?: ShaderMaterial;
  @Input() renderTargetDepthBuffer?: WebGLRenderTarget;
  @Input() renderTargetMaskDownSampleBuffer?: WebGLRenderTarget;
  @Input() renderTargetBlurBuffer1?: WebGLRenderTarget;
  @Input() renderTargetBlurBuffer2?: WebGLRenderTarget;
  @Input() edgeDetectionMaterial?: ShaderMaterial;
  @Input() renderTargetEdgeBuffer1?: WebGLRenderTarget;
  @Input() renderTargetEdgeBuffer2?: WebGLRenderTarget;
  @Input() separableBlurMaterial1?: ShaderMaterial;
  @Input() separableBlurMaterial2?: ShaderMaterial;
  @Input() overlayMaterial?: ShaderMaterial;
  @Input() copyUniforms?: UnknownRecord;
  @Input() materialCopy?: ShaderMaterial;
  @Input() oldClearColor?: Color;
  @Input() oldClearAlpha?: number;
  @Input() fsQuad?: UnknownRecord;
  @Input() tempPulseColor1?: Color;
  @Input() tempPulseColor2?: Color;
  @Input() textureMatrix?: Matrix4;

  passType = OutlinePass;
  extraInputs = [
    'renderScene',
    'renderCamera',
    'selectedObjects',
    'visibleEdgeColor',
    'hiddenEdgeColor',
    'edgeGlow',
    'usePatternTexture',
    'edgeThickness',
    'edgeStrength',
    'downSampleRatio',
    'pulsePeriod',
    'resolution',
    'patternTexture',
    'maskBufferMaterial',
    'renderTargetMaskBuffer',
    'depthMaterial',
    'prepareMaskMaterial',
    'renderTargetDepthBuffer',
    'renderTargetMaskDownSampleBuffer',
    'renderTargetBlurBuffer1',
    'renderTargetBlurBuffer2',
    'edgeDetectionMaterial',
    'renderTargetEdgeBuffer1',
    'renderTargetEdgeBuffer2',
    'separableBlurMaterial1',
    'separableBlurMaterial2',
    'overlayMaterial',
    'copyUniforms',
    'materialCopy',
    'oldClearColor',
    'oldClearAlpha',
    'fsQuad',
    'tempPulseColor1',
    'tempPulseColor2',
    'textureMatrix',
  ];
}
