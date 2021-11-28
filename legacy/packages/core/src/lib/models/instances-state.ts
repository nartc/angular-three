import * as THREE from 'packages/core/src/lib/models/three';
import type { NgtInstance } from './instance';

export interface InstancesStoreState {
  materials: Record<string, THREE.Material>;
  geometries: Record<string, THREE.BufferGeometry>;
  objects: Record<string, NgtInstance>;
}
