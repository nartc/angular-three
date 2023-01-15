import { NgtcPhysics } from '@angular-three/cannon';
import { NgtcDebug } from '@angular-three/cannon/debug';
import { injectBox, injectPlane } from '@angular-three/cannon/services';
import { extend, NgtArgs } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
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
  Mesh,
  PlaneGeometry,
  ShadowMaterial,
  BoxGeometry,
  MeshLambertMaterial,
  Color,
  AmbientLight,
  DirectionalLight,
  Vector2,
});

@Component({
  selector: 'floor',
  standalone: true,
  template: `
    <ngt-mesh [ref]="plane.ref" receiveShadow>
      <ngt-plane-geometry *args="args" />
      <ngt-shadow-material transparent color="#171717" opacity="0.4" />
    </ngt-mesh>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Floor {
  @Input() position: Triplet = [0, 0, 0];
  readonly rotation = [-Math.PI / 2, 0, 0] as Triplet;
  readonly args = [1000, 1000];

  readonly plane = injectPlane<Mesh>(() => ({
    args: this.args,
    position: this.position,
    rotation: this.rotation,
  }));
}

@Component({
  selector: 'cube',
  standalone: true,
  template: `
    <ngt-mesh [ref]="box.ref" receiveShadow castShadow>
      <ngt-box-geometry />
      <ngt-mesh-lambert-material color="hotpink" />
    </ngt-mesh>
  `,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Cube {
  @Input() position: Triplet = [0, 0, 0];
  readonly rotation = [0.4, 0.2, 0.5] as Triplet;
  readonly box = injectBox<Mesh>(() => ({
    mass: 1,
    position: this.position,
    rotation: this.rotation,
  }));
}

@Component({
  selector: 'physics-cubes-scene',
  standalone: true,
  template: `
    <ngt-color *args="['skyblue']" attach="background" />

    <ngt-ambient-light />
    <ngt-directional-light [position]="10" castShadow>
      <ngt-vector2 *args="[2048, 2048]" attach="shadow.mapSize" />
      <ngt-value [rawValue]="-0.001" attach="shadow.bias" />
    </ngt-directional-light>

    <ngtc-physics>
      <ngtc-debug>
        <floor [position]="[0, -2.5, 0]" />
        <cube [position]="[0.1, 5, 0]" />
        <cube [position]="[0, 10, -1]" />
        <cube [position]="[0, 20, -2]" />
      </ngtc-debug>
    </ngtc-physics>
  `,
  imports: [NgtcPhysics, NgtcDebug, NgtArgs, Floor, Cube],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}
