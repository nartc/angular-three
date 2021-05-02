import * as THREE from 'three';

export const attributes = [
  THREE.BufferAttribute,
  THREE.InstancedBufferAttribute,
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
].map((m) => m.name);
