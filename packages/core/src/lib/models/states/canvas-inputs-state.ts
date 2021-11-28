import * as THREE from 'three';
import { NgtCameraOptions } from '../camera';
import { NgtDpr } from '../dpr';
import { NgtGLOptions } from '../options/gl-options';
import { NgtRaycaster } from '../raycaster';
import { NgtSceneOptions } from '../scene';
import { NgtSize } from '../size';
import { NgtPerformance } from './performance-state';

export interface NgtCanvasInputsState {
  vr: boolean;
  linear: boolean;
  flat: boolean;
  orthographic: boolean;
  performance: NgtPerformance;
  size: NgtSize;
  dpr: NgtDpr;
  clock: THREE.Clock;
  frameloop: 'always' | 'demand' | 'never';
  raycaster: Partial<NgtRaycaster>;
  shadows: boolean | Partial<THREE.WebGLShadowMap>;
  cameraOptions: NgtCameraOptions;
  sceneOptions: NgtSceneOptions;
  glOptions: NgtGLOptions;
}
