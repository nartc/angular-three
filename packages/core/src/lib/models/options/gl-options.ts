import * as THREE from 'three';
import { Properties } from '../common';

export type NgtGLOptions =
  | THREE.Renderer
  | ((canvas: HTMLCanvasElement) => THREE.Renderer)
  | Partial<Properties<THREE.WebGLRenderer> | THREE.WebGLRendererParameters>;
