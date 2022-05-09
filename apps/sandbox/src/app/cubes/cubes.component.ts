import { NgtCanvasModule, NgtVector3 } from '@angular-three/core';
import { NgtColorAttributeModule } from '@angular-three/core/attributes';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtAmbientLightModule, NgtPointLightModule } from '@angular-three/core/lights';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Mesh } from 'three';

@Component({
  selector: 'sandbox-cubes',
  template: `
    <ngt-canvas initialLog>
      <ngt-color attach="background" color="lightblue"></ngt-color>
      <sandbox-scene></sandbox-scene>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxCubesComponent {}

@Component({
  selector: 'sandbox-scene',
  template: `
    <ngt-ambient-light></ngt-ambient-light>
    <ngt-point-light [position]="10"></ngt-point-light>

    <sandbox-cube [position]="[-1.5, 0, 0]"></sandbox-cube>
    <sandbox-cube [position]="[1.5, 0, 0]"></sandbox-cube>

    <sandbox-cube-with-materials></sandbox-cube-with-materials>

    <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scene {}

@Component({
  selector: 'sandbox-cube',
  template: `
    <ngt-mesh
      (pointerover)="hovered = true"
      (pointerout)="hovered = false"
      (click)="active = !active"
      (beforeRender)="onBeforeRender($event.object)"
      [scale]="active ? 1.5 : 1"
      [position]="position"
    >
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material [color]="hovered ? 'hotpink' : 'orange'"></ngt-mesh-standard-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cube {
  @Input() position?: NgtVector3;

  hovered = false;
  active = false;

  onBeforeRender(cube: Mesh) {
    cube.rotation.x += 0.01;
  }
}

@Component({
  selector: 'sandbox-cube-with-materials',
  template: `
    <ngt-mesh (beforeRender)="onBeforeRender($event.object)">
      <ngt-box-geometry></ngt-box-geometry>

      <ngt-mesh-standard-material
        *ngFor="let color of colors; index as i"
        [attach]="['material', '' + i]"
        [color]="color"
      ></ngt-mesh-standard-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeWithMaterials {
  colors = ['red', 'green', 'blue', 'hotpink', 'orange', 'teal'];

  onBeforeRender(cube: Mesh) {
    cube.rotation.x = cube.rotation.y += 0.01;
  }
}

@NgModule({
  declarations: [SandboxCubesComponent, Scene, Cube, CubeWithMaterials],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: SandboxCubesComponent }]),
    NgtCanvasModule,
    NgtColorAttributeModule,
    NgtAmbientLightModule,
    NgtPointLightModule,
    NgtStatsModule,
    NgtMeshModule,
    NgtBoxGeometryModule,
    NgtMeshStandardMaterialModule,
    NgtSobaOrbitControlsModule,
  ],
})
export class SandboxCubesModule {}
