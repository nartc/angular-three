import { NgtcPhysics } from '@angular-three/cannon';
import { injectBox, injectPlane, injectSphere } from '@angular-three/cannon/services';
import { extend, NgtArgs, NgtRef } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { Triplet } from '@pmndrs/cannon-worker-api';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import {
  BoxGeometry,
  Color,
  ColorRepresentation,
  HemisphereLight,
  InstancedBufferAttribute,
  InstancedMesh,
  Mesh,
  MeshLambertMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  PointLight,
  SphereGeometry,
  SpotLight,
  Vector2,
} from 'three';

const niceColor = niceColors[Math.floor(Math.random() * niceColors.length)];

extend({
  InstancedMesh,
  SphereGeometry,
  InstancedBufferAttribute,
  MeshPhongMaterial,
  Mesh,
  BoxGeometry,
  MeshLambertMaterial,
  PlaneGeometry,
  HemisphereLight,
  SpotLight,
  PointLight,
  Vector2,
});

@Component({
  selector: 'sandbox-spheres',
  standalone: true,
  template: `
    <ng-container *args="[undefined, undefined, count]">
      <ngt-instanced-mesh *ref="spheresBody.ref" castShadow receiveShadow>
        <ngt-sphere-geometry *args="[radius, 16, 16]">
          <ngt-instanced-buffer-attribute
            *args="[colors, 3]"
            attach="attributes.color"
          ></ngt-instanced-buffer-attribute>
        </ngt-sphere-geometry>
        <ngt-mesh-phong-material vertexColors></ngt-mesh-phong-material>
      </ngt-instanced-mesh>
    </ng-container>
  `,
  imports: [NgtArgs, NgtRef],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Spheres implements OnInit {
  @Input() count = 100;

  readonly radius = 1;
  colors!: Float32Array;

  readonly spheresBody = injectSphere<InstancedMesh>((index) => ({
    args: [this.radius],
    mass: 1,
    position: [Math.random() - 0.5, Math.random() - 0.5, index * 2],
  }));

  ngOnInit(): void {
    this.colors = new Float32Array(this.count * 3);
    const color = new Color();

    for (let i = 0; i < this.count; i++) {
      color
        .set(niceColor[Math.floor(Math.random() * 5)])
        .convertSRGBToLinear()
        .toArray(this.colors, i * 3);
    }
  }
}

@Component({
  selector: 'sandbox-box',
  standalone: true,
  template: `
    <ngt-mesh
      *ref="boxBody.ref"
      castShadow
      receiveShadow
      (beforeRender)="onBoxBeforeRender($any($event).state.clock)"
    >
      <ngt-box-geometry *args="boxSize"></ngt-box-geometry>
      <ngt-mesh-lambert-material></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  imports: [NgtRef, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Box {
  readonly boxSize: Triplet = [4, 4, 4];

  readonly boxBody = injectBox<Mesh>(() => ({
    mass: 1,
    type: 'Kinematic',
    args: this.boxSize,
  }));

  onBoxBeforeRender(clock: THREE.Clock) {
    const t = clock.getElapsedTime();
    this.boxBody.api.position.set(Math.sin(t * 2) * 5, Math.cos(t * 2) * 5, 3);
    this.boxBody.api.rotation.set(Math.sin(t * 6), Math.cos(t * 6), 0);
  }
}

@Component({
  selector: 'sandbox-plane',
  standalone: true,
  template: `
    <ngt-mesh *ref="planeBody.ref" receiveShadow>
      <ngt-plane-geometry *args="args"></ngt-plane-geometry>
      <ngt-mesh-phong-material [color]="color"></ngt-mesh-phong-material>
    </ngt-mesh>
  `,
  imports: [NgtRef, NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Plane {
  @Input() color!: ColorRepresentation;
  @Input() position?: Triplet;
  @Input() rotation?: Triplet;

  readonly args = [1000, 1000] as [number, number];

  readonly planeBody = injectPlane<Mesh>(() => ({
    args: this.args,
    position: this.position,
    rotation: this.rotation,
  }));
}

@Component({
  selector: 'sandbox-kinematic-cube-scene',
  standalone: true,
  template: `
    <ngt-hemisphere-light intensity="0.35"></ngt-hemisphere-light>
    <ngt-spot-light [position]="[30, 0, 30]" intensity="2" angle="0.3" penumbra="1" castShadow>
      <ngt-vector2 *args="[256, 256]" attach="shadow.mapSize"></ngt-vector2>
    </ngt-spot-light>
    <ngt-point-light [position]="[-30, 0, -30]" intensity="0.5"></ngt-point-light>

    <ngtc-physics [gravity]="[0, 0, -30]">
      <sandbox-plane [color]="niceColor[4]"></sandbox-plane>
      <sandbox-plane
        [color]="niceColor[1]"
        [position]="[-6, 0, 0]"
        [rotation]="[0, 0.9, 0]"
      ></sandbox-plane>
      <sandbox-plane
        [color]="niceColor[2]"
        [position]="[6, 0, 0]"
        [rotation]="[0, -0.9, 0]"
      ></sandbox-plane>
      <sandbox-plane
        [color]="niceColor[3]"
        [position]="[0, 6, 0]"
        [rotation]="[0.9, 0, 0]"
      ></sandbox-plane>
      <sandbox-plane
        [color]="niceColor[0]"
        [position]="[0, -6, 0]"
        [rotation]="[-0.9, 0, 0]"
      ></sandbox-plane>
      <sandbox-box></sandbox-box>
      <sandbox-spheres [count]="100"></sandbox-spheres>
    </ngtc-physics>
  `,
  imports: [NgtArgs, NgtcPhysics, Plane, Box, Spheres],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {
    readonly niceColor = niceColor;
}
