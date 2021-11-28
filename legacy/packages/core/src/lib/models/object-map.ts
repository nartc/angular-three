import * as THREE from 'packages/core/src/lib/models/three';

export interface NgtObjectMap {
  nodes: { [name: string]: THREE.Object3D };
  materials: { [name: string]: THREE.Material };
}
