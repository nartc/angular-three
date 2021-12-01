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
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-simple-cube',
  template: `
    <ngt-canvas>
      <ngt-stats></ngt-stats>

      <ngt-ambient-light></ngt-ambient-light>
      <ngt-spot-light [position]="[1, 1, 1]"></ngt-spot-light>

      <ngt-mesh
        #mesh="ngtMesh"
        (animateReady)="onAnimateReady(mesh.mesh)"
        (pointerover)="hover = true"
        (pointerout)="hover = false"
      >
        <ngt-mesh-standard-material
          [parameters]="{ color: hover ? 'turquoise' : 'tomato' }"
        ></ngt-mesh-standard-material>
        <ngt-box-geometry></ngt-box-geometry>
      </ngt-mesh>

      <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleCubeComponent {
  hover = false;

  onAnimateReady(mesh: THREE.Mesh) {
    mesh.rotation.x = mesh.rotation.y += 0.01;
  }
}

@NgModule({
  declarations: [SimpleCubeComponent],
  exports: [SimpleCubeComponent],
  imports: [
    NgtCoreModule,
    NgtStatsModule,
    NgtAmbientLightModule,
    NgtSpotLightModule,
    NgtMeshModule,
    NgtMeshStandardMaterialModule,
    NgtBoxGeometryModule,
    NgtSobaOrbitControlsModule,
  ],
})
export class SimpleCubeComponentModule {}
