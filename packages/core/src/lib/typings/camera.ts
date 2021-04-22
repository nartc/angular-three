import type { OrthographicCamera, PerspectiveCamera } from 'three';
import { RecursivePartial } from './common';
import type { Overwrite, ThreeCommonParameters } from './three';

export type ThreeCamera = OrthographicCamera | PerspectiveCamera;

export type CameraOptions =
  | ThreeCamera
  | Overwrite<RecursivePartial<PerspectiveCamera>, ThreeCommonParameters>
  | Overwrite<RecursivePartial<OrthographicCamera>, ThreeCommonParameters>;
