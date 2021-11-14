import * as THREE from 'three';
import type { EntityCollection } from '../models/entity-collection.model';

export const lines: EntityCollection = {
  core: [THREE.Line, THREE.LineLoop, THREE.LineSegments].map((m) => m.name),
  examples: ['Line2', 'LineSegments2', 'Wireframe'],
};
