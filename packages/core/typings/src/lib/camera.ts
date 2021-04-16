import type { OrthographicCamera, PerspectiveCamera } from 'three';
import type { Overwrite, ThreeCommonParameters } from './three';

export type ThreeCamera = OrthographicCamera | PerspectiveCamera;

export type CameraOptions =
  | ThreeCamera
  | Overwrite<Partial<PerspectiveCamera>, ThreeCommonParameters>
  | Overwrite<Partial<OrthographicCamera>, ThreeCommonParameters>;
