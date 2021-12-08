import { NgtCoreModule } from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import {
  NgtAmbientLightModule,
  NgtSpotLightModule,
} from '@angular-three/core/lights';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtSobaBoxModule } from '@angular-three/soba/shapes';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-simple-cube',
  template: `
    <ngt-canvas>
      <ngt-stats></ngt-stats>
      <ngt-ambient-light></ngt-ambient-light>
      <ngt-spot-light [position]="[1, 1, 1]"></ngt-spot-light>
      <ngt-cube></ngt-cube>
      <ngt-soba-orbit-controls [target]='[0,2,0]'></ngt-soba-orbit-controls>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleCubeComponent {}

@Component({
  selector: 'ngt-cube',
  template: `
    <ngt-soba-box
      #sobaBox="ngtSobaBox"
      (animateReady)="onAnimateReady(sobaBox.object)"
      (pointerover)="hover = true"
      (pointerout)="hover = false"
    >
      <ngt-mesh-standard-material
        [parameters]="{ color: hover ? 'turquoise' : 'tomato' }"
      ></ngt-mesh-standard-material>
    </ngt-soba-box>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeComponent {
  hover = false;

  onAnimateReady(mesh: THREE.Mesh) {
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z += 0.01;
  }
}

@NgModule({
  declarations: [SimpleCubeComponent, CubeComponent],
  exports: [SimpleCubeComponent, CubeComponent],
  imports: [
    NgtCoreModule,
    NgtStatsModule,
    NgtAmbientLightModule,
    NgtSpotLightModule,
    NgtMeshModule,
    NgtMeshStandardMaterialModule,
    NgtBoxGeometryModule,
    NgtSobaOrbitControlsModule,
    NgtSobaBoxModule,
  ],
})
export class SimpleCubeComponentModule {}
