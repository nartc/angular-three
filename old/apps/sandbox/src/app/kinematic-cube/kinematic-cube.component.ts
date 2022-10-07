import { NgtPhysicBody, NgtPhysics } from '@angular-three/cannon';
import { NgtCanvas, NgtEuler, NgtRenderState, NgtTriple, NgtVector3 } from '@angular-three/core';
import { NgtInstancedBufferAttribute, NgtVector2Attribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry, NgtPlaneGeometry, NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtHemisphereLight, NgtPointLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgtMeshLambertMaterial, NgtMeshPhongMaterial } from '@angular-three/core/materials';
import { NgtInstancedMesh, NgtMesh } from '@angular-three/core/meshes';
import { NgtStats } from '@angular-three/core/stats';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import * as THREE from 'three';

const niceColor = niceColors[Math.floor(Math.random() * niceColors.length)];

@Component({
  selector: 'sandbox-spheres',
  standalone: true,
  template: `
    <ngt-instanced-mesh [ref]="sphereRef.ref" [count]="number" castShadow receiveShadow>
      <ngt-sphere-geometry [args]="[1, 16, 16]">
        <ngt-instanced-buffer-attribute
          [attach]="['attributes', 'color']"
          [args]="[colors, 3]"
        ></ngt-instanced-buffer-attribute>
      </ngt-sphere-geometry>
      <ngt-mesh-phong-material vertexColors></ngt-mesh-phong-material>
    </ngt-instanced-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgtInstancedMesh, NgtSphereGeometry, NgtInstancedBufferAttribute, NgtMeshPhongMaterial],
})
export class InstancedSpheres implements OnInit {
  @Input() number = 100;

  colors!: Float32Array;

  readonly sphereRef = this.physicBody.useSphere<THREE.InstancedMesh>((index) => ({
    args: [1],
    mass: 1,
    position: [Math.random() - 0.5, Math.random() - 0.5, index * 2],
  }));

  constructor(private physicBody: NgtPhysicBody) {}

  ngOnInit() {
    this.colors = new Float32Array(this.number * 3);
    const color = new THREE.Color();

    for (let i = 0; i < this.number; i++) {
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
      [ref]="boxRef.ref"
      [castShadow]="true"
      [receiveShadow]="true"
      (beforeRender)="onBoxBeforeRender($event.state)"
    >
      <ngt-box-geometry [args]="boxSize"></ngt-box-geometry>
      <ngt-mesh-lambert-material></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshLambertMaterial],
})
export class Box {
  readonly boxSize: NgtTriple = [4, 4, 4];

  readonly boxRef = this.physicBody.useBox<THREE.Mesh>(() => ({
    mass: 1,
    type: 'Kinematic',
    args: this.boxSize,
  }));

  constructor(private physicBody: NgtPhysicBody) {}

  onBoxBeforeRender({ clock }: NgtRenderState) {
    const t = clock.getElapsedTime();
    this.boxRef.api.position.set(Math.sin(t * 2) * 5, Math.cos(t * 2) * 5, 3);
    this.boxRef.api.rotation.set(Math.sin(t * 6), Math.cos(t * 6), 0);
  }
}

@Component({
  selector: 'sandbox-plane',
  standalone: true,
  template: `
    <ngt-mesh [ref]="planeRef.ref" [rotation]="rotation" [position]="position" receiveShadow>
      <ngt-plane-geometry [args]="[1000, 1000]"></ngt-plane-geometry>
      <ngt-mesh-phong-material [color]="color!"></ngt-mesh-phong-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
  imports: [NgtMesh, NgtPlaneGeometry, NgtMeshPhongMaterial],
})
export class Plane {
  @Input() color?: THREE.ColorRepresentation;
  @Input() position?: NgtVector3;
  @Input() rotation?: NgtEuler;

  readonly planeRef = this.physicBody.usePlane<THREE.Mesh>(() => ({
    position: this.position as NgtTriple,
    rotation: this.rotation as NgtTriple,
  }));

  constructor(private physicBody: NgtPhysicBody) {}
}

@Component({
  selector: 'sandbox-scene',
  standalone: true,
  template: `
    <ngt-hemisphere-light intensity="0.35"></ngt-hemisphere-light>
    <ngt-spot-light [position]="[30, 0, 30]" intensity="2" angle="0.3" penumbra="1" castShadow>
      <ngt-vector2 [attach]="['shadow', 'mapSize']" [vector2]="256"></ngt-vector2>
    </ngt-spot-light>
    <ngt-point-light [position]="[-30, 0, -30]" intensity="0.5"></ngt-point-light>

    <ngt-physics [gravity]="[0, 0, -30]">
      <sandbox-plane [color]="niceColor[4]"></sandbox-plane>
      <sandbox-plane [color]="niceColor[1]" [position]="[-6, 0, 0]" [rotation]="[0, 0.9, 0]"></sandbox-plane>
      <sandbox-plane [color]="niceColor[2]" [position]="[6, 0, 0]" [rotation]="[0, -0.9, 0]"></sandbox-plane>
      <sandbox-plane [color]="niceColor[3]" [position]="[0, 6, 0]" [rotation]="[0.9, 0, 0]"></sandbox-plane>
      <sandbox-plane [color]="niceColor[0]" [position]="[0, -6, 0]" [rotation]="[-0.9, 0, 0]"></sandbox-plane>

      <sandbox-box></sandbox-box>
      <sandbox-spheres [number]="100"></sandbox-spheres>
    </ngt-physics>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtHemisphereLight,
    NgtSpotLight,
    NgtVector2Attribute,
    NgtPointLight,
    NgtPhysics,
    Plane,
    Box,
    InstancedSpheres,
  ],
})
export class Scene {
  readonly niceColor = niceColor;
}

@Component({
  selector: 'sandbox-kinematic-cube',
  standalone: true,
  template: `
    <ngt-canvas shadows [gl]="{ alpha: false }" [camera]="{ position: [0, -12, 16] }">
      <sandbox-scene></sandbox-scene>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtCanvas, Scene, NgtStats],
})
export class KinematicCubeComponent {}
