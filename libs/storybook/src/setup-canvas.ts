import { NgtColorPipeModule, NgtCoreModule } from '@angular-three/core';
import {
    NgtAmbientLightModule,
    NgtPointLightModule,
} from '@angular-three/core/lights';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtSobaLoaderModule } from '@angular-three/soba/loaders';

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
      [shadows]="true"
      [camera]="{position: [${cameraPosition}], fov: ${cameraFov}}"
      [scene]='{background: "${black ? 'black' : 'white'}" | color}'
    >
      <ngt-stats></ngt-stats>

      <ng-container *ngIf="${lights}">
        <ngt-ambient-light [intensity]="0.8"></ngt-ambient-light>
        <ngt-point-light [intensity]="1" [position]="[0, 6, 0]"></ngt-point-light>
      </ng-container>

      <ngt-soba-orbit-controls *ngIf="${controls}" [makeDefault]="${makeControlsDefault}" ></ngt-soba-orbit-controls>

      ${story}
    </ngt-canvas>
    <ngt-soba-loader *ngIf="${loader}"></ngt-soba-loader>
  `;
}

export const setupCanvasModules = [
    NgtCoreModule,
    NgtStatsModule,
    NgtAmbientLightModule,
    NgtPointLightModule,
    NgtSobaOrbitControlsModule,
    NgtColorPipeModule,
    NgtSobaLoaderModule,
];
