import { NgtCoreModule, NgtLoaderService, NgtStore } from '@angular-three/core';
import { NgtGridHelperModule } from '@angular-three/core/helpers';
import { NgtDirectionalLightModule } from '@angular-three/core/lights';
import { NgtMeshLambertMaterialModule } from '@angular-three/core/materials';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtSobaBoxModule } from '@angular-three/soba/shapes';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';

@Component({
  selector: 'ngt-cube-transform',
  template: `
    <ngt-canvas
      (created)="$event.camera.lookAt(0, 200, 0)"
      [camera]="{
        fov: 50,
        near: 0.01,
        far: 30000,
        position: [1000, 500, 1000]
      }"
    >
      <ngt-directional-light
        [position]="[1, 1, 1]"
        [args]="['#ffffff', 2]"
      ></ngt-directional-light>

      <ngt-grid-helper
        [args]="[1000, 10, '#888888', '#444444']"
      ></ngt-grid-helper>

      <ngt-crate></ngt-crate>

      <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeTransformComponent {}

@Component({
  selector: 'ngt-crate',
  template: `
    <ngt-soba-box [args]="[200, 200, 200]">
      <ngt-mesh-lambert-material
        [parameters]="{ map: texture$ | async, transparent: true }"
      ></ngt-mesh-lambert-material>
    </ngt-soba-box>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CrateComponent {
  texture$ = this.loaderService
    .use(THREE.TextureLoader, '/assets/crate.gif')
    .pipe(
      tap((texture) => {
        texture.anisotropy =
          this.store.get('renderer')?.capabilities.getMaxAnisotropy() || 1;
      })
    );

  constructor(
    private loaderService: NgtLoaderService,
    private store: NgtStore
  ) {}
}

@NgModule({
  declarations: [CubeTransformComponent, CrateComponent],
  exports: [CubeTransformComponent],
  imports: [
    CommonModule,
    NgtSobaBoxModule,
    NgtMeshLambertMaterialModule,
    NgtCoreModule,
    NgtDirectionalLightModule,
    NgtGridHelperModule,
    NgtSobaOrbitControlsModule,
  ],
})
export class CubeTransformComponentModule {}
