import * as THREE from 'three';
import type { EntityCollection } from '../models/entity-collection.model';

export const helpers: EntityCollection = {
  core: [
    THREE.ArrowHelper,
    THREE.AxesHelper,
    THREE.BoxHelper,
    THREE.Box3Helper,
    THREE.GridHelper,
    THREE.CameraHelper,
    THREE.DirectionalLightHelper,
    THREE.HemisphereLightHelper,
    THREE.PlaneHelper,
    THREE.PointLightHelper,
    THREE.PolarGridHelper,
    THREE.SkeletonHelper,
    THREE.SpotLightHelper,
  ].map((m) => m.name),
  examples: [
    'LightProbeHelper',
    'PositionalAudioHelper',
    'RectAreaLightHelper',
    'VertexNormalsHelper',
    'VertexTangentsHelper',
  ],
};
