import { NgtPhysics } from '@angular-three/cannon';
import { NgtDebug } from '@angular-three/cannon/debug';
import { NgtPhysicsBody } from '@angular-three/cannon/services';
import { NgtCanvas } from '@angular-three/core';
import { NgtColorAttribute, NgtVector2Attribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry, NgtPlaneGeometry } from '@angular-three/core/geometries';
import { NgtAmbientLight, NgtDirectionalLight } from '@angular-three/core/lights';
import { NgtMeshLambertMaterial, NgtShadowMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtStats } from '@angular-three/core/stats';
import { Component, inject, Input } from '@angular/core';
import { Triplet } from '@pmndrs/cannon-worker-api';
import * as THREE from 'three';

@Component({
  selector: 'floor',
  standalone: true,
  template: `
    <ngt-mesh receiveShadow [ref]="planeBody.ref" [position]="position" [rotation]="rotation">
      <ngt-plane-geometry [args]="args"></ngt-plane-geometry>
      <ngt-shadow-material transparent color="#171717" opacity="0.4"></ngt-shadow-material>
    </ngt-mesh>
  `,
  imports: [NgtMesh, NgtPlaneGeometry, NgtShadowMaterial],
  providers: [NgtPhysicsBody],
})
class Floor {
  @Input() position?: Triplet;
  readonly rotation = [-Math.PI / 2, 0, 0] as Triplet;
  readonly args = [1000, 1000] as [number, number];

  readonly planeBody = inject(NgtPhysicsBody).usePlane<THREE.Mesh>(() => ({
    args: this.args,
    rotation: this.rotation,
    position: this.position,
  }));
}

@Component({
  selector: 'cube',
  standalone: true,
  template: `
    <ngt-mesh receiveShadow castShadow [ref]="boxBody.ref" [position]="position" [rotation]="rotation">
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-lambert-material color="tomato"></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  providers: [NgtPhysicsBody],
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshLambertMaterial],
})
class Cube {
  @Input() position?: Triplet;
  readonly rotation = [0.4, 0.2, 0.5] as Triplet;

  readonly boxBody = inject(NgtPhysicsBody).useBox<THREE.Mesh>(() => ({
    mass: 1,
    position: this.position,
    rotation: this.rotation,
  }));
}

@Component({
  selector: 'scene',
  standalone: true,
  template: `
    <ngt-ambient-light></ngt-ambient-light>
    <ngt-directional-light [position]="10" castShadow>
      <ngt-vector2 [attach]="['shadow', 'mapSize']" [vector2]="2048"></ngt-vector2>
    </ngt-directional-light>

    <ngt-physics>
      <ngt-debug>
        <floor [position]="[0, -2.5, 0]"></floor>
        <cube [position]="[0.1, 5, 0]"></cube>
        <cube [position]="[0, 10, -1]"></cube>
        <cube [position]="[0, 20, -2]"></cube>
      </ngt-debug>
    </ngt-physics>
  `,
  imports: [NgtAmbientLight, NgtDirectionalLight, NgtVector2Attribute, NgtPhysics, Floor, Cube, NgtDebug],
})
class Scene {}

@Component({
  selector: 'sandbox-physic-cubes',
  standalone: true,
  template: `
    <ngt-canvas initialLog shadows [dpr]="[1, 2]" [gl]="{ alpha: false }" [camera]="{ position: [-1, 5, 5], fov: 45 }">
      <ngt-color attach="background" color="lightblue"></ngt-color>
      <scene></scene>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  imports: [NgtCanvas, NgtColorAttribute, Scene, NgtStats],
})
export default class SandboxPhysicCubes {}
