import { NgtCanvas, NgtState } from '@angular-three/core';
import { NgtColorAttribute } from '@angular-three/core/attributes';
import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtStats } from '@angular-three/core/stats';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import * as THREE from 'three';

interface CanvasOptions {
  camera?: {
    position?: [number, number, number];
    fov?: number;
  };
  background?: string;
  controls?:
    | boolean
    | {
        makeDefault?: boolean;
      };
  lights?: boolean;
}

const defaultCanvasOptions: CanvasOptions = {
  camera: {
    position: [-5, 5, 5],
    fov: 75,
  },
  background: 'black',
  controls: true,
  lights: true,
};

export function setupCanvas(canvasOptions?: CanvasOptions) {
  const mergedOptions = canvasOptions
    ? {
        ...defaultCanvasOptions,
        ...canvasOptions,
        camera: {
          ...defaultCanvasOptions.camera,
          ...(canvasOptions.camera || {}),
        },
      }
    : defaultCanvasOptions;

  return (story: string) => `
<ngt-canvas
  shadows
  (created)="onCanvasCreated($event)"
  [camera]="{
    position: [${mergedOptions.camera!.position}],
    fov: ${mergedOptions.camera!.fov}
  }"
>
  <ngt-color
    attach="background"
    color="${mergedOptions.background}"
  ></ngt-color>

  <ng-container *ngIf="${mergedOptions.lights}">
    <ngt-ambient-light intensity="0.8"></ngt-ambient-light>
    <ngt-point-light intensity="1" [position]="[0, 6, 0]"></ngt-point-light>
  </ng-container>

  <ng-container *ngIf="${mergedOptions.controls}">
    <ngt-soba-orbit-controls
      [makeDefault]="${
        typeof mergedOptions.controls === 'object' &&
        mergedOptions.controls.makeDefault
      }"
    ></ngt-soba-orbit-controls>
  </ng-container>

  ${story}
</ngt-canvas>
<ngt-stats></ngt-stats>
    `;
}

export const setupCanvasImports = [
  NgtCanvas,
  NgtAmbientLight,
  NgtPointLight,
  NgtColorAttribute,
  NgtSobaOrbitControls,
  NgtStats,
];

export function onCanvasCreated($event: NgtState) {
  console.log($event);
}

export function turn(object: THREE.Object3D) {
  object.rotation.y += 0.01;
}
