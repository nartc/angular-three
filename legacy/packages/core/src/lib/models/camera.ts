import * as THREE from 'packages/core/src/lib/models/three';
import type { NgtCommonParameters, Overwrite } from './three';

export type NgtCamera = THREE.OrthographicCamera | THREE.PerspectiveCamera;

export type NgtCameraOptions =
  | NgtCamera
  | Overwrite<Partial<THREE.PerspectiveCamera>, NgtCommonParameters>
  | Overwrite<Partial<THREE.OrthographicCamera>, NgtCommonParameters>;
