import * as THREE from 'three';
import type { NgtCamera } from './camera';
import type { NgtRaycaster } from './raycaster';
import type { NgtSize } from './size';
import type { NgtViewport } from './viewport';

export interface CanvasInternal {
  active: boolean;
  size: NgtSize;
  dpr: number;
  viewport: NgtViewport & {
    getCurrentViewport: (
      camera?: NgtCamera,
      target?: THREE.Vector3,
      size?: NgtSize
    ) => Omit<NgtViewport, 'dpr' | 'initialDpr'>;
  };
}

export interface CanvasStoreState {
  isOrthographic: boolean;
  isLinear: boolean;
  shadows: boolean | Partial<THREE.WebGLShadowMap>;
  alpha: boolean;
  clock: THREE.Clock;
  mouse: THREE.Vector2;
  internal: CanvasInternal;
  renderer?: THREE.WebGLRenderer;
  camera?: NgtCamera;
  scene?: THREE.Scene;
  raycaster?: NgtRaycaster;
}
