import * as THREE from 'three';

export const materials = [
  THREE.ShadowMaterial,
  THREE.SpriteMaterial,
  THREE.RawShaderMaterial,
  THREE.ShaderMaterial,
  THREE.PointsMaterial,
  THREE.MeshPhysicalMaterial,
  THREE.MeshStandardMaterial,
  THREE.MeshPhongMaterial,
  THREE.MeshToonMaterial,
  THREE.MeshNormalMaterial,
  THREE.MeshLambertMaterial,
  THREE.MeshDepthMaterial,
  THREE.MeshDistanceMaterial,
  THREE.MeshBasicMaterial,
  THREE.MeshMatcapMaterial,
  THREE.LineDashedMaterial,
  THREE.LineBasicMaterial,
].map((m) => m.name);
