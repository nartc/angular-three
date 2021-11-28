import * as THREE from 'three';
import type { EntityCollection } from '../models/entity-collection.model';

export const lights: EntityCollection = {
  core: [
    THREE.LightProbe,
    THREE.AmbientLight,
    THREE.AmbientLightProbe,
    THREE.HemisphereLight,
    THREE.HemisphereLightProbe,
    THREE.DirectionalLight,
    THREE.PointLight,
    THREE.SpotLight,
    THREE.RectAreaLight,
  ].map((m) => ({ name: m.name })),
};
