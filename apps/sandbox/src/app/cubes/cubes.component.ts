import { NgtCanvas, NgtVector3 } from '@angular-three/core';
import { NgtColorAttribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtStats } from '@angular-three/core/stats';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'cube',
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
      <ngt-mesh-standard-material
        [color]="hovered ? 'hotpink' : 'orange'"
      ></ngt-mesh-standard-material>
    </ngt-mesh>
  `,
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshStandardMaterial],
})
export class Cube {
  @Input() position?: NgtVector3;

  hovered = false;
  active = false;

  onBeforeRender(cube: THREE.Mesh) {
    cube.rotation.x = cube.rotation.y += 0.01;
  }
}

@Component({
  selector: 'cube-with-materials',
  standalone: true,
  template: `
    <ngt-mesh (beforeRender)="onBeforeRender($event.object)">
      <ngt-box-geometry></ngt-box-geometry>

      <ngt-mesh-standard-material
        *ngFor="let color of colors; index as i"
        [attach]="['material', i]"
        [color]="color"
      ></ngt-mesh-standard-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtMesh, NgtMeshStandardMaterial, NgForOf, NgtBoxGeometry],
})
export class CubeWithMaterials {
  readonly colors = [
    'red',
    'green',
    'blue',
    'hotpink',
    'orange',
    'teal',
  ] as const;

  onBeforeRender(cube: THREE.Mesh) {
    cube.rotation.x = cube.rotation.y += 0.01;
  }
}

@Component({
  selector: 'scene',
  standalone: true,
  template: `
    <ngt-ambient-light></ngt-ambient-light>
    <ngt-point-light [position]="10"></ngt-point-light>

    <cube [position]="[-1.5, 0, 0]"></cube>
    <cube [position]="[1.5, 0, 0]"></cube>

    <cube-with-materials></cube-with-materials>

    <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtAmbientLight,
    NgtPointLight,
    Cube,
    CubeWithMaterials,
    NgtSobaOrbitControls,
  ],
})
export class Scene {}

@Component({
  selector: 'sandbox-cubes',
  standalone: true,
  template: `
    <ngt-canvas>
      <ngt-color color="lightblue" attach="background"></ngt-color>
      <scene></scene>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtCanvas, NgtColorAttribute, NgtStats, Scene],
})
export default class SandboxCubes {}
