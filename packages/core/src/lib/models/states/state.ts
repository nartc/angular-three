import * as THREE from 'three';
import { NgtCamera } from '../camera';
import { NgtRaycaster } from '../raycaster';
import { NgtSize } from '../size';
import { NgtCurrentViewport, NgtViewport } from '../viewport';

export interface NgtState {
  mouse: THREE.Vector2;
  clock: THREE.Clock;
  frameloop: 'always' | 'demand' | 'never';
  ready: boolean;
  vr: boolean;
  size: NgtSize;
  viewport: NgtViewport & {
    getCurrentViewport: (
      camera?: NgtCamera,
      target?: THREE.Vector3,
      size?: NgtSize
    ) => NgtCurrentViewport;
  };
  renderer?: THREE.WebGLRenderer;
  camera?: NgtCamera;
  scene?: THREE.Scene;
  raycaster?: NgtRaycaster;
}

export interface NgtCreatedState {
  mouse: THREE.Vector2;
  clock: THREE.Clock;
  renderer: THREE.WebGLRenderer;
  size: NgtSize;
  viewport: NgtViewport;
  camera: NgtCamera;
  scene: THREE.Scene;
  raycaster: NgtRaycaster;
}
