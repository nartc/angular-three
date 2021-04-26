import type { Clock, Scene, Vector2, WebGLRenderer } from 'three';
import type { ThreeCamera } from './camera';
import type { Size } from './size';

export interface RenderState {
  clock: Clock;
  size: Size;
  renderer: WebGLRenderer;
  camera: ThreeCamera;
  scene: Scene;
  mouse: Vector2;
  delta: number;
}
