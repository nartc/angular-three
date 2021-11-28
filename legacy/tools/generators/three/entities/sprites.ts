import * as THREE from 'three';
import type { EntityCollection } from '../models/entity-collection.model';

export const sprites: EntityCollection = {
  core: [THREE.Sprite].map((m) => ({ name: m.name })),
};
