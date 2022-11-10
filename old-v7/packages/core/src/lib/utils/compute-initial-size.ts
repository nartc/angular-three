import * as THREE from 'three';
import type { NgtSize } from '../types';
import { is } from './is';

export function computeInitialSize(canvas: HTMLCanvasElement | THREE.OffscreenCanvas, defaultSize?: NgtSize): NgtSize {
  if (defaultSize) {
    return defaultSize;
  }

  if (is.canvas(canvas) && canvas.parentElement) {
    const { width, height, top, left } = canvas.parentElement.getBoundingClientRect();

    return { width, height, top, left };
  }

  return { width: 0, height: 0, top: 0, left: 0 };
}
