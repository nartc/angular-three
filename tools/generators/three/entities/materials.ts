import * as THREE from 'three';
import type { EntityCollection } from '../models/entity-collection.model';

export const materials: EntityCollection = {
  core: [
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
  ].map((m) => m.name),
  examples: ['LineMaterial'],
  from: {
    LineMaterial: 'lines',
  },
};
