import * as THREE from 'three';
import type { EntityCollection } from '../models/entity-collection.model';

export const cameras: EntityCollection = {
  core: [
    THREE.Camera,
    THREE.PerspectiveCamera,
    THREE.OrthographicCamera,
    THREE.ArrayCamera,
    THREE.StereoCamera,
  ].map((m) => ({ name: m.name })),
};
