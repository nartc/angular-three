import * as THREE from 'three';

export const lines = [THREE.Line, THREE.LineLoop, THREE.LineSegments].map(
  (m) => m.name
);
