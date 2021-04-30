import type {
  Clock,
  Scene,
  Vector2,
  WebGLRenderer,
  WebGLShadowMap,
} from 'three';
import type { ThreeCameraAlias } from '../camera';
import type { ThreeRaycaster } from '../raycaster';
import type { Size } from '../size';

export interface CanvasInternal {
  active: boolean;
  size: Size;
  dpr: number;
}

export interface CanvasStoreState {
  isOrthographic: boolean;
  isLinear: boolean;
  shadows: boolean | Partial<WebGLShadowMap>;
  clock: Clock;
  mouse: Vector2;
  internal: CanvasInternal;
  renderer?: WebGLRenderer;
  camera?: ThreeCameraAlias;
  scene?: Scene;
  raycaster?: ThreeRaycaster;
}
