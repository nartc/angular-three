import { NgtCanvasModule, NgtColorPipeModule } from '@angular-three/core';
import { NgtColorAttributeModule } from '@angular-three/core/attributes';
import {
    NgtAmbientLightModule,
    NgtPointLightModule,
} from '@angular-three/core/lights';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtSobaLoaderModule } from '@angular-three/soba/loaders';
import * as THREE from 'three';

export function setupCanvas({
    cameraPosition = [-5, 5, 5],
    cameraFov = 75,
    lights = true,
    controls = true,
    makeControlsDefault = false,
    black = true,
    loader = false,
}: Partial<{
    cameraPosition: [number, number, number];
    cameraFov: number;
    controls: boolean;
    makeControlsDefault: boolean;
    lights: boolean;
    black: boolean;
    loader: boolean;
}> = {}) {
    return (story: string) => `
    <ngt-canvas
      shadows
      initialLog
      [camera]="{position: [${cameraPosition}], fov: ${cameraFov}}"
    >
      <ngt-color attach="background" color=${
          black ? 'black' : 'white'
      }></ngt-color>

      <ng-container *ngIf="${lights}">
        <ngt-ambient-light intensity="0.8"></ngt-ambient-light>
        <ngt-point-light intensity="1" [position]="[0, 6, 0]"></ngt-point-light>
      </ng-container>

      <ngt-soba-orbit-controls *ngIf="${controls}" [makeDefault]="${makeControlsDefault}" ></ngt-soba-orbit-controls>

      ${story}
    </ngt-canvas>
    <ngt-stats></ngt-stats>
    <ngt-soba-loader *ngIf="${loader}"></ngt-soba-loader>
  `;
}

export const setupCanvasModules = [
    NgtCanvasModule,
    NgtColorAttributeModule,
    NgtStatsModule,
    NgtAmbientLightModule,
    NgtPointLightModule,
    NgtSobaOrbitControlsModule,
    NgtColorPipeModule,
    NgtSobaLoaderModule,
];

export function turnAnimate(object: THREE.Object3D) {
    object.rotation.y += 0.01;
}
