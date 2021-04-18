import type { Clock, Scene, WebGLRenderer } from 'three';
import type { ThreeCamera } from './camera';
import type { Size } from './size';

export interface RenderState {
  clock: Clock;
  size: Size;
  renderer: WebGLRenderer;
  camera: ThreeCamera;
  scene: Scene;
  delta: number;
}
