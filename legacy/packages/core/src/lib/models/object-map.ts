import * as THREE from 'three';

export interface NgtObjectMap {
  nodes: { [name: string]: THREE.Object3D };
  materials: { [name: string]: THREE.Material };
}
