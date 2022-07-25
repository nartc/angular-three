import { NgtCanvas, NgtVector3 } from '@angular-three/core';
import { NgtColorAttribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtStats } from '@angular-three/core/stats';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Mesh } from 'three';

@Component({
  selector: 'sandbox-cube',
  standalone: true,
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
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshStandardMaterial],
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
  standalone: true,
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
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshStandardMaterial, NgForOf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeWithMaterials {
  colors = ['red', 'green', 'blue', 'hotpink', 'orange', 'teal'];

  onBeforeRender(cube: Mesh) {
    cube.rotation.x = cube.rotation.y += 0.01;
  }
}

@Component({
  selector: 'sandbox-scene',
  standalone: true,
  template: `
    <ngt-ambient-light></ngt-ambient-light>
    <ngt-point-light [position]="10"></ngt-point-light>

    <sandbox-cube [position]="[-1.5, 0, 0]"></sandbox-cube>
    <sandbox-cube [position]="[1.5, 0, 0]"></sandbox-cube>

    <sandbox-cube-with-materials></sandbox-cube-with-materials>

    <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
  `,
  imports: [NgtAmbientLight, NgtPointLight, NgtSobaOrbitControls, CubeWithMaterials, Cube],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scene {}

@Component({
  selector: 'sandbox-cubes',
  standalone: true,
  template: `
    <ngt-canvas initialLog>
      <ngt-color attach="background" color="lightblue"></ngt-color>
      <sandbox-scene></sandbox-scene>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  imports: [NgtCanvas, NgtStats, NgtColorAttribute, Scene],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxCubesComponent {}
