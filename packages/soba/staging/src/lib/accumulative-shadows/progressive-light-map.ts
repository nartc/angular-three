import { shaderMaterial } from '@angular-three/soba/shaders';
import * as THREE from 'three';

function isLight(object: any): object is THREE.Light {
  return object.isLight;
}

function isGeometry(object: any): object is THREE.Mesh {
  return !!object.geometry;
}

const DiscardMaterial = shaderMaterial(
  {},
  'void main() { gl_Position = vec4((uv - 0.5) * 2.0, 1.0, 1.0); }',
  'void main() { discard; }'
);

export class ProgressiveLightMap {
  renderer: THREE.WebGLRenderer;
  res: number;
  scene: THREE.Scene;
  object: THREE.Mesh | null;
  buffer1Active: boolean;
  progressiveLightMap1: THREE.WebGLRenderTarget;
  progressiveLightMap2: THREE.WebGLRenderTarget;
  discardMat: THREE.ShaderMaterial;
  targetMat: THREE.MeshLambertMaterial;
  previousShadowMap: { value: THREE.Texture };
  averagingWindow: { value: number };
  clearColor: THREE.Color;
  clearAlpha: number;
  lights: { object: THREE.Light; intensity: number }[];
  meshes: { object: THREE.Mesh; material: THREE.Material | THREE.Material[] }[];

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, res: number = 1024) {
    this.renderer = renderer;
    this.res = res;
    this.scene = scene;
    this.buffer1Active = false;
    this.lights = [];
    this.meshes = [];
    this.object = null;
    this.clearColor = new THREE.Color();
    this.clearAlpha = 0;

    // Create the Progressive LightMap Texture
    const format = /(Android|iPad|iPhone|iPod)/g.test(navigator.userAgent)
      ? THREE.HalfFloatType
      : THREE.FloatType;
    this.progressiveLightMap1 = new THREE.WebGLRenderTarget(this.res, this.res, {
      type: format,
      encoding: renderer.outputEncoding,
    });
    this.progressiveLightMap2 = new THREE.WebGLRenderTarget(this.res, this.res, {
      type: format,
      encoding: renderer.outputEncoding,
    });

    // Inject some spicy new logic into a standard phong material
    this.discardMat = new DiscardMaterial();
    this.targetMat = new THREE.MeshLambertMaterial({ fog: false });
    this.previousShadowMap = { value: this.progressiveLightMap1.texture };
    this.averagingWindow = { value: 100 };
    this.targetMat.onBeforeCompile = (shader) => {
      // Vertex Shader: Set Vertex Positions to the Unwrapped UV Positions
      shader.vertexShader =
        'varying vec2 vUv;\n' +
        shader.vertexShader.slice(0, -1) +
        'vUv = uv; gl_Position = vec4((uv - 0.5) * 2.0, 1.0, 1.0); }';

      // Fragment Shader: Set Pixels to average in the Previous frame's Shadows
      const bodyStart = shader.fragmentShader.indexOf('void main() {');
      shader.fragmentShader =
        'varying vec2 vUv;\n' +
        shader.fragmentShader.slice(0, bodyStart) +
        'uniform sampler2D previousShadowMap;\n	uniform float averagingWindow;\n' +
        shader.fragmentShader.slice(bodyStart - 1, -1) +
        `\nvec3 texelOld = texture2D(previousShadowMap, vUv).rgb;
        gl_FragColor.rgb = mix(texelOld, gl_FragColor.rgb, 1.0/ averagingWindow);
      }`;

      // Set the Previous Frame's Texture Buffer and Averaging Window
      shader.uniforms['previousShadowMap'] = this.previousShadowMap;
      shader.uniforms['averagingWindow'] = this.averagingWindow;
    };
  }

  clear() {
    this.renderer.getClearColor(this.clearColor);
    this.clearAlpha = this.renderer.getClearAlpha();
    this.renderer.setClearColor('black', 1);
    this.renderer.setRenderTarget(this.progressiveLightMap1);
    this.renderer.clear();
    this.renderer.setRenderTarget(this.progressiveLightMap2);
    this.renderer.clear();
    this.renderer.setRenderTarget(null);
    this.renderer.setClearColor(this.clearColor, this.clearAlpha);

    this.lights = [];
    this.meshes = [];
    this.scene.traverse((object) => {
      if (isGeometry(object)) {
        this.meshes.push({ object, material: object.material });
      } else if (isLight(object)) {
        this.lights.push({ object, intensity: object.intensity });
      }
    });
  }

  prepare() {
    this.lights.forEach((light) => (light.object.intensity = 0));
    this.meshes.forEach((mesh) => (mesh.object.material = this.discardMat));
  }

  finish() {
    this.lights.forEach((light) => (light.object.intensity = light.intensity));
    this.meshes.forEach((mesh) => (mesh.object.material = mesh.material));
  }

  configure(object: any) {
    this.object = object;
  }

  update(camera: any, blendWindow = 100) {
    if (!this.object) return;
    // Set each object's material to the UV Unwrapped Surface Mapping Version
    this.averagingWindow.value = blendWindow;
    this.object.material = this.targetMat;
    // Ping-pong two surface buffers for reading/writing
    const activeMap = this.buffer1Active ? this.progressiveLightMap1 : this.progressiveLightMap2;
    const inactiveMap = this.buffer1Active ? this.progressiveLightMap2 : this.progressiveLightMap1;
    // Render the object's surface maps
    const oldBg = this.scene.background;
    this.scene.background = null;
    this.renderer.setRenderTarget(activeMap);
    this.previousShadowMap.value = inactiveMap.texture;
    this.buffer1Active = !this.buffer1Active;
    this.renderer.render(this.scene, camera);
    this.renderer.setRenderTarget(null);
    this.scene.background = oldBg;
  }
}
