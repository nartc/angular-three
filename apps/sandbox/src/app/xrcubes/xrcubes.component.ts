import { NgtCanvasModule, NgtState, NgtVector3 } from '@angular-three/core';
import { NgtColorAttributeModule } from '@angular-three/core/attributes';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtAmbientLightModule, NgtPointLightModule } from '@angular-three/core/lights';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Mesh } from 'three';
import { VRButton } from 'three-stdlib';
import { NgtGroupModule } from '@angular-three/core/group';

@Component({
  selector: 'xrsandbox-cubes',
  template: `
    <ngt-canvas initialLog (created)="created($event)" >
      <ngt-color attach="background" color="lightblue"></ngt-color>

      <sandbox-scene></sandbox-scene>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxXRCubesComponent {
    created(state: NgtState) {
        document.body.appendChild(VRButton.createButton(state.gl));
    }

}

@Component({
  selector: 'sandbox-scene',
  template: `
    <ngt-ambient-light></ngt-ambient-light>
    <ngt-point-light [position]="10"></ngt-point-light>

    <sandbox-cube *ngIf="ready" [position]="[-1.5, 0, 0]"></sandbox-cube>
    <sandbox-cube *ngIf="ready" [position]="[1.5, 0, 0]"></sandbox-cube>

    <sandbox-cube-with-materials  *ngIf="ready"></sandbox-cube-with-materials>

    <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scene {
  ready = false;

  constructor(private cd: ChangeDetectorRef) {
    setTimeout(() => {
      this.ready = true;
      this.cd.detectChanges();
    }, 10000);
  }
}

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
  declarations: [SandboxXRCubesComponent, Scene, Cube, CubeWithMaterials],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: SandboxXRCubesComponent }]),
    NgtCanvasModule,
    NgtColorAttributeModule,
    NgtAmbientLightModule,
    NgtPointLightModule,
    NgtStatsModule,
    NgtMeshModule,
    NgtGroupModule,
    NgtBoxGeometryModule,
    NgtMeshStandardMaterialModule,
    NgtSobaOrbitControlsModule,
  ],
})
export class SandboxXRCubesModule {}
