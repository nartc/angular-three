import * as THREE from 'three';
import { ConvolutionMaterial } from './convolution-material';

export interface BlurPassProps {
  gl: THREE.WebGLRenderer;
  resolution: number;
  width?: number;
  height?: number;
  minDepthThreshold?: number;
  maxDepthThreshold?: number;
  depthScale?: number;
  depthToBlurRatioBias?: number;
}

export class BlurPass {
  readonly renderTargetA: THREE.WebGLRenderTarget;
  readonly renderTargetB: THREE.WebGLRenderTarget;
  readonly convolutionMaterial: ConvolutionMaterial;
  readonly scene: THREE.Scene;
  readonly camera: THREE.Camera;
  readonly screen: THREE.Mesh;
  renderToScreen = false;

  constructor({
    gl,
    resolution,
    width = 500,
    height = 500,
    minDepthThreshold = 0,
    maxDepthThreshold = 1,
    depthScale = 0,
    depthToBlurRatioBias = 0.25,
  }: BlurPassProps) {
    this.renderTargetA = new THREE.WebGLRenderTarget(resolution, resolution, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      stencilBuffer: false,
      depthBuffer: false,
      encoding: gl.outputEncoding,
    });
    this.renderTargetB = this.renderTargetA.clone();
    this.convolutionMaterial = new ConvolutionMaterial();
    this.convolutionMaterial.setTexelSize(1.0 / width, 1.0 / height);
    this.convolutionMaterial.setResolution(new THREE.Vector2(width, height));
    this.scene = new THREE.Scene();
    this.camera = new THREE.Camera();
    this.convolutionMaterial.uniforms['minDepthThreshold'].value = minDepthThreshold;
    this.convolutionMaterial.uniforms['maxDepthThreshold'].value = maxDepthThreshold;
    this.convolutionMaterial.uniforms['depthScale'].value = depthScale;
    this.convolutionMaterial.uniforms['depthToBlurRatioBias'].value = depthToBlurRatioBias;
    this.convolutionMaterial.defines['USE_DEPTH'] = depthScale > 0;
    const vertices = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
    const uvs = new Float32Array([0, 0, 2, 0, 0, 2]);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    this.screen = new THREE.Mesh(geometry, this.convolutionMaterial);
    this.screen.frustumCulled = false;
    this.scene.add(this.screen);
  }

  render(renderer: THREE.WebGLRenderer, inputBuffer: any, outputBuffer: any) {
    const scene = this.scene;
    const camera = this.camera;
    const renderTargetA = this.renderTargetA;
    const renderTargetB = this.renderTargetB;
    const material = this.convolutionMaterial;
    const uniforms = material.uniforms;
    uniforms['depthBuffer'].value = inputBuffer.depthTexture;
    const kernel = material.kernel;
    let lastRT = inputBuffer;
    let destRT;
    let i, l;
    // Apply the multi-pass blur.
    for (i = 0, l = kernel.length - 1; i < l; ++i) {
      // Alternate between targets.
      destRT = (i & 1) === 0 ? renderTargetA : renderTargetB;
      uniforms['kernel'].value = kernel[i];
      uniforms['inputBuffer'].value = lastRT.texture;
      renderer.setRenderTarget(destRT);
      renderer.render(scene, camera);
      lastRT = destRT;
    }
    uniforms['kernel'].value = kernel[i];
    uniforms['inputBuffer'].value = lastRT.texture;
    renderer.setRenderTarget(this.renderToScreen ? null : outputBuffer);
    renderer.render(scene, camera);
  }
}
