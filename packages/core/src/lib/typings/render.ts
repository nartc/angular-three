import type { Clock, Scene, Vector2, WebGLRenderer } from 'three';
import type { ThreeCameraAlias } from './camera';
import type { Size } from './size';
import type { Viewport } from './viewport';

export interface RenderState {
  clock: Clock;
  size: Size;
  viewport: Viewport;
  renderer: WebGLRenderer;
  camera: ThreeCameraAlias;
  scene: Scene;
  mouse: Vector2;
  delta: number;
}
