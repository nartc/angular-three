import type { OrthographicCamera, PerspectiveCamera } from 'three';
import type { Overwrite, ThreeCommonParameters } from './three';

export type ThreeCameraAlias = OrthographicCamera | PerspectiveCamera;

export type CameraOptions =
  | ThreeCameraAlias
  | Overwrite<Partial<PerspectiveCamera>, ThreeCommonParameters>
  | Overwrite<Partial<OrthographicCamera>, ThreeCommonParameters>;
