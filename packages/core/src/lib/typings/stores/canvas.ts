import type {
  Clock,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
  WebGLShadowMap,
} from 'three';
import type { ThreeCameraAlias } from '../camera';
import type { ThreeRaycaster } from '../raycaster';
import type { Size } from '../size';
import type { Viewport } from '../viewport';

export interface CanvasInternal {
  active: boolean;
  size: Size;
  dpr: number;
  viewport: Viewport & {
    getCurrentViewport: (
      camera?: ThreeCameraAlias,
      target?: Vector3,
      size?: Size
    ) => Omit<Viewport, 'dpr' | 'initialDpr'>;
  };
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
