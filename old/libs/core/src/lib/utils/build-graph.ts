import * as THREE from 'three';
import type { NgtObjectMap } from '../types';

export function buildGraph(object: THREE.Object3D): NgtObjectMap {
  const data: NgtObjectMap = { nodes: {}, materials: {} };
  if (object) {
    object.traverse((obj: any) => {
      if (obj['name']) {
        data.nodes[obj['name']] = obj;
      }
      if (obj['material'] && !data.materials[obj['material']['name']]) {
        data.materials[obj['material']['name']] = obj['material'];
      }
    });
  }
  return data;
}
