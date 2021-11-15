// GENERATED
import type { UnknownRecord } from '@angular-three/core';
import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';

@Directive({
  selector: 'ngt-outline-pass',
  exportAs: 'ngtOutlinePass',
  providers: [{ provide: NgtPass, useExisting: NgtOutlinePass }],
})
export class NgtOutlinePass extends NgtPass<OutlinePass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof OutlinePass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof OutlinePass>) {
    this.extraArgs = v;
  }

  @Input() renderScene?: THREE.Scene;
  @Input() renderCamera?: THREE.Camera;
  @Input() selectedObjects?: THREE.Object3D[];
  @Input() visibleEdgeColor?: THREE.Color;
  @Input() hiddenEdgeColor?: THREE.Color;
  @Input() edgeGlow?: number;
  @Input() usePatternTexture?: boolean;
  @Input() edgeThickness?: number;
  @Input() edgeStrength?: number;
  @Input() downSampleRatio?: number;
  @Input() pulsePeriod?: number;
  @Input() resolution?: THREE.Vector2;
  @Input() patternTexture?: THREE.Texture;
  @Input() maskBufferMaterial?: THREE.MeshBasicMaterial;
  @Input() renderTargetMaskBuffer?: THREE.WebGLRenderTarget;
  @Input() depthMaterial?: THREE.MeshDepthMaterial;
  @Input() prepareMaskMaterial?: THREE.ShaderMaterial;
  @Input() renderTargetDepthBuffer?: THREE.WebGLRenderTarget;
  @Input() renderTargetMaskDownSampleBuffer?: THREE.WebGLRenderTarget;
  @Input() renderTargetBlurBuffer1?: THREE.WebGLRenderTarget;
  @Input() renderTargetBlurBuffer2?: THREE.WebGLRenderTarget;
  @Input() edgeDetectionMaterial?: THREE.ShaderMaterial;
  @Input() renderTargetEdgeBuffer1?: THREE.WebGLRenderTarget;
  @Input() renderTargetEdgeBuffer2?: THREE.WebGLRenderTarget;
  @Input() separableBlurMaterial1?: THREE.ShaderMaterial;
  @Input() separableBlurMaterial2?: THREE.ShaderMaterial;
  @Input() overlayMaterial?: THREE.ShaderMaterial;
  @Input() copyUniforms?: UnknownRecord;
  @Input() materialCopy?: THREE.ShaderMaterial;
  @Input() oldClearColor?: THREE.Color;
  @Input() oldClearAlpha?: number;
  @Input() fsQuad?: UnknownRecord;
  @Input() tempPulseColor1?: THREE.Color;
  @Input() tempPulseColor2?: THREE.Color;
  @Input() textureMatrix?: THREE.Matrix4;

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
