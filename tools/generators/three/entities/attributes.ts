import * as THREE from 'three';
import type { EntityCollection } from '../models/entity-collection.model';

export const attributes: EntityCollection = {
  core: [
    THREE.BufferAttribute,
    THREE.InstancedBufferAttribute,
    THREE.InterleavedBufferAttribute,
    THREE.Float16BufferAttribute,
    THREE.Float32BufferAttribute,
    THREE.Float64BufferAttribute,
    THREE.Int8BufferAttribute,
    THREE.Int16BufferAttribute,
    THREE.Int32BufferAttribute,
    THREE.Uint8BufferAttribute,
    THREE.Uint16BufferAttribute,
    THREE.Uint32BufferAttribute,
    THREE.Uint8ClampedBufferAttribute,
  ].map((m) => ({ name: m.name })),
};
