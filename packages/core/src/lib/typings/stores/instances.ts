import type { BufferGeometry, Material } from 'three';
import type { ThreeInstance } from '../instance';

export interface InstancesStoreState {
  materials: Record<string, Material>;
  bufferGeometries: Record<string, BufferGeometry>;
  objects: Record<string, ThreeInstance>;
}
