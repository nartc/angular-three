import { NgtsPhysics } from '@angular-three/cannon';
import { NgtcDebug } from '@angular-three/cannon/debug';
import { injectBox, injectPlane } from '@angular-three/cannon/services';
import { extend, NgtArgs, NgtRef, NgtScene } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, Input } from '@angular/core';
import { Triplet } from '@pmndrs/cannon-worker-api';
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  PlaneGeometry,
  ShadowMaterial,
  Vector2,
} from 'three';

extend({
  Color,
  Mesh,
  AmbientLight,
  DirectionalLight,
  Vector2,
  PlaneGeometry,
  ShadowMaterial,
  BoxGeometry,
  MeshLambertMaterial,
});

@Component({
  selector: 'floor',
  standalone: true,
  template: `
    <ngt-mesh *ref="plane.ref" [receiveShadow]="true">
      <ngt-plane-geometry *args="args"></ngt-plane-geometry>
      <ngt-shadow-material
        [transparent]="true"
        color="#171717"
        [opacity]="0.4"
      ></ngt-shadow-material>
    </ngt-mesh>
  `,
  imports: [NgtRef, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Floor {
  @Input() position: Triplet = [0, 0, 0];
  readonly rotation = [-Math.PI / 2, 0, 0] as Triplet;
  readonly args = [1000, 1000];

  readonly plane = injectPlane<THREE.Mesh>(() => ({
    args: this.args,
    rotation: this.rotation,
    position: this.position,
  }));
}

@Component({
  selector: 'cube',
  standalone: true,
  template: `
    <ngt-mesh *ref="box.ref" [receiveShadow]="true" [castShadow]="true">
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-lambert-material color="tomato"></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  imports: [NgtRef],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Cube {
  @Input() position: Triplet = [0, 0, 0];
  readonly rotation = [0.4, 0.2, 0.5] as Triplet;
  readonly box = injectBox<THREE.Mesh>(() => ({
    mass: 1,
    position: this.position,
    rotation: this.rotation,
  }));
}

@NgtScene()
@Component({
  standalone: true,
  template: `
    <ngt-color *args="['lightblue']" attach="background"></ngt-color>

    <ngt-ambient-light></ngt-ambient-light>
    <ngt-directional-light [position]="10" [castShadow]="true">
      <ngt-vector2 *args="[2048, 2048]" attach="shadow.mapSize"></ngt-vector2>
    </ngt-directional-light>

    <ngtc-physics>
      <floor [position]="[0, -2.5, 0]"></floor>
      <cube [position]="[0.1, 5, 0]"></cube>
      <cube [position]="[0, 10, -1]"></cube>
      <cube [position]="[0, 20, -2]"></cube>
    </ngtc-physics>
  `,
  imports: [NgtArgs, NgtsPhysics, NgtcDebug, Floor, Cube],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export default class Scene {
  readonly host = inject(ElementRef);

  ngOnInit() {
    console.log(this.host);
  }
}
