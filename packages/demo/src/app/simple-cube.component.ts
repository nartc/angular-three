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
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-simple-cube',
  template: `
    <ngt-canvas>
      <ngt-stats></ngt-stats>
      <ngt-ambient-light></ngt-ambient-light>
      <ngt-spot-light [position]="[1, 1, 1]"></ngt-spot-light>
      <ngt-cube></ngt-cube>
      <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleCubeComponent {}

@Component({
  selector: 'ngt-cube',
  template: `
    <ngt-soba-box
      #sobaBox
      (animateReady)="onAnimateReady(sobaBox.object)"
      (pointerover)="hover = true"
      (pointerout)="hover = false"
      [isMaterialArray]="true"
    >
      <ngt-cube-materials [hover]="hover"></ngt-cube-materials>
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

@Component({
  selector: 'ngt-cube-materials',
  template: `
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'turquoise' : 'tomato' }"
    ></ngt-mesh-standard-material>
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'hotpink' : 'orange' }"
    ></ngt-mesh-standard-material>
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'blue' : 'red' }"
    ></ngt-mesh-standard-material>
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'green' : 'yellow' }"
    ></ngt-mesh-standard-material>
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'purple' : 'brown' }"
    ></ngt-mesh-standard-material>
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'tomato' : 'turquoise' }"
    ></ngt-mesh-standard-material>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeMaterials {
  @Input() hover = false;
}

@NgModule({
  declarations: [SimpleCubeComponent, CubeComponent, CubeMaterials],
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
