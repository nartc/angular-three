import * as THREE from 'three';
import type { NgtCamera } from './camera';
import type { NgtSize } from './size';
import type { NgtViewport } from './viewport';

export interface NgtRender {
  clock: THREE.Clock;
  size: NgtSize;
  viewport: NgtViewport;
  renderer: THREE.WebGLRenderer;
  camera: NgtCamera;
  scene: THREE.Scene;
  mouse: THREE.Vector2;
  delta: number;
}
