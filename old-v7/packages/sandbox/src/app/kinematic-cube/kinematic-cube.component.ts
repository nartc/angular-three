import { NgtPhysics } from '@angular-three/cannon';
import { NgtPhysicsBody } from '@angular-three/cannon/services';
import { NgtCanvas } from '@angular-three/core';
import { NgtInstancedBufferAttribute, NgtVector2Attribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry, NgtPlaneGeometry, NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtHemisphereLight, NgtPointLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgtMeshLambertMaterial, NgtMeshPhongMaterial } from '@angular-three/core/materials';
import { NgtInstancedMesh, NgtMesh } from '@angular-three/core/objects';
import { NgtStats } from '@angular-three/core/stats';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { Triplet } from '@pmndrs/cannon-worker-api';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import * as THREE from 'three';

const niceColor = niceColors[Math.floor(Math.random() * niceColors.length)];

@Component({
  selector: 'spheres',
  standalone: true,
  template: `
    <ngt-instanced-mesh [ref]="sphereBody.ref" [count]="number" castShadow receiveShadow>
      <ngt-sphere-geometry [args]="[radius, 16, 16]">
        <ngt-instanced-buffer-attribute
          [attach]="['attributes', 'color']"
          [args]="[colors, 3]"
        ></ngt-instanced-buffer-attribute>
      </ngt-sphere-geometry>
      <ngt-mesh-phong-material vertexColors></ngt-mesh-phong-material>
    </ngt-instanced-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicsBody],
  imports: [NgtInstancedMesh, NgtSphereGeometry, NgtInstancedBufferAttribute, NgtMeshPhongMaterial],
})
class Spheres implements OnInit {
  @Input() number = 100;
  readonly radius = 1;
  colors!: Float32Array;

  readonly sphereBody = inject(NgtPhysicsBody).useSphere<THREE.InstancedMesh>((index) => ({
    args: [this.radius],
    mass: 1,
    position: [Math.random() - 0.5, Math.random() - 0.5, index * 2],
  }));

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
  selector: 'box',
  standalone: true,
  template: `
    <ngt-mesh [ref]="boxBody.ref" castShadow receiveShadow (beforeRender)="onBoxBeforeRender($event.state.clock)">
      <ngt-box-geometry [args]="boxSize"></ngt-box-geometry>
      <ngt-mesh-lambert-material></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  providers: [NgtPhysicsBody],
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshLambertMaterial],
})
class Box {
  readonly boxSize: Triplet = [4, 4, 4];

  readonly boxBody = inject(NgtPhysicsBody).useBox<THREE.Mesh>(() => ({
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
  selector: 'plane',
  standalone: true,
  template: `
    <ngt-mesh [ref]="planeBody.ref" [rotation]="rotation" [position]="position" receiveShadow>
      <ngt-plane-geometry [args]="[1000, 1000]"></ngt-plane-geometry>
      <ngt-mesh-phong-material [color]="color!"></ngt-mesh-phong-material>
    </ngt-mesh>
  `,
  providers: [NgtPhysicsBody],
  imports: [NgtMesh, NgtPlaneGeometry, NgtMeshPhongMaterial],
})
class Plane {
  @Input() color?: THREE.ColorRepresentation;
  @Input() position?: Triplet;
  @Input() rotation?: Triplet;

  readonly args = [1000, 1000] as [number, number];

  readonly planeBody = inject(NgtPhysicsBody).usePlane<THREE.Mesh>(() => ({
    args: this.args,
    position: this.position,
    rotation: this.rotation,
  }));
}

@Component({
  selector: 'scene',
  standalone: true,
  template: `
    <ngt-hemisphere-light intensity="0.35"></ngt-hemisphere-light>
    <ngt-spot-light [position]="[30, 0, 30]" intensity="2" angle="0.3" penumbra="1" castShadow>
      <ngt-vector2 [attach]="['shadow', 'mapSize']" [vector2]="256"></ngt-vector2>
    </ngt-spot-light>
    <ngt-point-light [position]="[-30, 0, -30]" intensity="0.5"></ngt-point-light>

    <ngt-physics [gravity]="[0, 0, -30]">
      <plane [color]="niceColor[4]"></plane>
      <plane [color]="niceColor[1]" [position]="[-6, 0, 0]" [rotation]="[0, 0.9, 0]"></plane>
      <plane [color]="niceColor[2]" [position]="[6, 0, 0]" [rotation]="[0, -0.9, 0]"></plane>
      <plane [color]="niceColor[3]" [position]="[0, 6, 0]" [rotation]="[0.9, 0, 0]"></plane>
      <plane [color]="niceColor[0]" [position]="[0, -6, 0]" [rotation]="[-0.9, 0, 0]"></plane>

      <box></box>
      <spheres [number]="100"></spheres>
    </ngt-physics>
  `,
  imports: [NgtHemisphereLight, NgtSpotLight, NgtVector2Attribute, NgtPointLight, NgtPhysics, Plane, Box, Spheres],
})
class Scene {
  readonly niceColor = niceColor;
}

@Component({
  selector: 'kinematic-cube',
  standalone: true,
  template: `
    <ngt-canvas shadows [gl]="{ alpha: false }" [camera]="{ position: [0, -12, 16] }">
      <scene></scene>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  imports: [NgtCanvas, NgtStats, Scene],
})
export default class SandboxKinematicCube {}
