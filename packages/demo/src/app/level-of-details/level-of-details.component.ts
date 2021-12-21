import {
  NgtCoreModule,
  NgtMathPipeModule,
  NgtRepeatModule,
} from '@angular-three/core';
import { NgtIcosahedronGeometryModule } from '@angular-three/core/geometries';
import {
  NgtDirectionalLightModule,
  NgtPointLightModule,
} from '@angular-three/core/lights';
import { NgtMeshLambertMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import {
  NgtSobaFlyControls,
  NgtSobaFlyControlsModule,
} from '@angular-three/soba/controls';
import { NgtSobaDetailedModule } from '@angular-three/soba/performances';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-level-of-details',
  template: `
    <ngt-canvas
      [linear]="true"
      [camera]="{ fov: 45, near: 1, far: 15000, position: [0, 0, 1000] }"
      [scene]="{ fog }"
      (created)="
        $event.camera.updateProjectionMatrix();
        $event.renderer.setClearColor('black')
      "
    >
      <ngt-point-light [position]="[0, 0, 0]" color="#ff2200"></ngt-point-light>
      <ngt-directional-light
        [position]="[0, 0, 1]"
        color="#ffffff"
      ></ngt-directional-light>

      <ngt-stats></ngt-stats>

      <ngt-mesh-lambert-material
        #lambertMaterial="ngtMeshLambertMaterial"
        [parameters]="{ color: '#ffffff', wireframe: true }"
      ></ngt-mesh-lambert-material>

      <ngt-icosahedron-geometry
        #geometry16="ngtIcosahedronGeometry"
        [args]="[100, 16]"
      ></ngt-icosahedron-geometry>
      <ngt-icosahedron-geometry
        #geometry8="ngtIcosahedronGeometry"
        [args]="[100, 8]"
      ></ngt-icosahedron-geometry>
      <ngt-icosahedron-geometry
        #geometry4="ngtIcosahedronGeometry"
        [args]="[100, 4]"
      ></ngt-icosahedron-geometry>
      <ngt-icosahedron-geometry
        #geometry2="ngtIcosahedronGeometry"
        [args]="[100, 2]"
      ></ngt-icosahedron-geometry>
      <ngt-icosahedron-geometry
        #geometry1="ngtIcosahedronGeometry"
        [args]="[100, 1]"
      ></ngt-icosahedron-geometry>

      <ngt-soba-detailed
        #lod
        *repeat="let _ of 1000"
        [position]="[
          10000 * (0.5 - (1 | mathConst: 'random')),
          7500 * (0.5 - (1 | mathConst: 'random')),
          10000 * (0.5 - (1 | mathConst: 'random'))
        ]"
        [distances]="[50, 300, 1000, 2000, 8000]"
      >
        <ngt-mesh
          #ngtMesh="ngtMesh"
          [disabled]="true"
          [geometry]="geometry16.geometry"
          [material]="lambertMaterial.material"
          [scale]="[1.5, 1.5, 1.5]"
        ></ngt-mesh>
        <ngt-mesh
          #ngtMesh="ngtMesh"
          [disabled]="true"
          [geometry]="geometry8.geometry"
          [material]="lambertMaterial.material"
          [scale]="[1.5, 1.5, 1.5]"
        ></ngt-mesh>
        <ngt-mesh
          #ngtMesh="ngtMesh"
          [disabled]="true"
          [geometry]="geometry4.geometry"
          [material]="lambertMaterial.material"
          [scale]="[1.5, 1.5, 1.5]"
        ></ngt-mesh>
        <ngt-mesh
          #ngtMesh="ngtMesh"
          [disabled]="true"
          [geometry]="geometry2.geometry"
          [material]="lambertMaterial.material"
          [scale]="[1.5, 1.5, 1.5]"
        ></ngt-mesh>
        <ngt-mesh
          #ngtMesh="ngtMesh"
          [disabled]="true"
          [geometry]="geometry1.geometry"
          [material]="lambertMaterial.material"
          [scale]="[1.5, 1.5, 1.5]"
        ></ngt-mesh>
      </ngt-soba-detailed>
      <ngt-soba-fly-controls
        #flyControls="ngtSobaFlyControls"
        (ready)="onReady(flyControls)"
      ></ngt-soba-fly-controls>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelOfDetailsComponent {
  fog = new THREE.Fog('#000000', 1, 15000);

  onReady(flyControls: NgtSobaFlyControls) {
    flyControls.controls.movementSpeed = 1000;
    flyControls.controls.rollSpeed = Math.PI / 10;
  }
}

@NgModule({
  declarations: [LevelOfDetailsComponent],
  exports: [LevelOfDetailsComponent],
  imports: [
    NgtCoreModule,
    NgtStatsModule,
    NgtSobaFlyControlsModule,
    NgtPointLightModule,
    NgtDirectionalLightModule,
    NgtSobaDetailedModule,
    NgtRepeatModule,
    NgtMeshModule,
    NgtIcosahedronGeometryModule,
    NgtMeshLambertMaterialModule,
    NgtMathPipeModule,
  ],
})
export class LevelOfDetailsModule {}
