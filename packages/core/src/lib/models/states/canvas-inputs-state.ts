import * as THREE from 'three';
import { NgtCameraOptions } from '../camera';
import { NgtDpr } from '../dpr';
import { NgtGLOptions } from '../options/gl-options';
import { NgtRaycaster } from '../raycaster';
import { NgtSceneOptions } from '../scene';

export interface NgtCanvasInputsState {
  dpr: NgtDpr;
  raycaster: Partial<NgtRaycaster>;
  shadows: boolean | Partial<THREE.WebGLShadowMap>;
  cameraOptions: NgtCameraOptions;
  sceneOptions: NgtSceneOptions;
  glOptions: NgtGLOptions;
}
