import * as THREE from 'three';

export const textures = [
  THREE.CanvasTexture,
  THREE.CompressedTexture,
  THREE.CubeTexture,
  THREE.DataTexture,
  THREE.DataTexture2DArray,
  THREE.DataTexture3D,
  THREE.DepthTexture,
  THREE.VideoTexture,
].map((m) => m.name);
