import { NgtPhysics } from '@angular-three/cannon';
import { NgtPhysicsBody } from '@angular-three/cannon/services';
import { NgtCanvas, NgtStore } from '@angular-three/core';
import { NgtVector2Attribute } from '@angular-three/core/attributes';
import { NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtAmbientLight, NgtDirectionalLight, NgtSpotLight } from '@angular-three/core/lights';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtInstancedMesh } from '@angular-three/core/objects';
import { NgtEffectComposer } from '@angular-three/postprocessing';
import { NgtBloomEffect } from '@angular-three/postprocessing/effects';
import { NgtTextureLoader } from '@angular-three/soba/loaders';
import { NgtSobaEnvironment, NgtSobaSky } from '@angular-three/soba/staging';
import { Component, Directive, inject, NgZone, OnInit } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'pointer',
  standalone: true,
  providers: [NgtPhysicsBody],
})
class Pointer implements OnInit {
  private readonly store = inject(NgtStore);
  private readonly zone = inject(NgZone);

  readonly pointerBody = inject(NgtPhysicsBody).useSphere(
    () => ({
      type: 'Kinematic',
      args: [3],
      position: [0, 0, 0],
    }),
    false
  );

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() =>
        this.store.registerBeforeRender({
          callback: ({ pointer, viewport }) => {
            this.pointerBody.api.position.set((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0);
          },
        })
      );
    });
  }
}

const mat = new THREE.Matrix4();
const vec = new THREE.Vector3();

@Component({
  selector: 'clump',
  standalone: true,
  template: `
    <ngt-instanced-mesh
      [ref]="sphereBody.ref"
      [count]="count"
      castShadow
      receiveShadow
      (beforeRender)="onBeforeRender($event.object)"
    >
      <ngt-sphere-geometry [args]="[1, 32, 32]"></ngt-sphere-geometry>
      <ngt-mesh-standard-material
        color="red"
        roughness="0"
        envMapIntensity="0.2"
        emissive="#370037"
        [map]="texture$"
      ></ngt-mesh-standard-material>
    </ngt-instanced-mesh>
  `,
  imports: [NgtInstancedMesh, NgtSphereGeometry, NgtMeshStandardMaterial],
  providers: [NgtPhysicsBody],
})
class Clump {
  readonly count = 40;
  readonly store = inject(NgtStore);
  readonly texture$ = inject(NgtTextureLoader).load(
    'assets/cross.jpg',
    this.store.select((s) => s.gl)
  );

  readonly sphereBody = inject(NgtPhysicsBody).useSphere<THREE.InstancedMesh>(() => ({
    args: [1],
    mass: 1,
    angularDamping: 0.1,
    linearDamping: 0.65,
    position: [
      THREE.MathUtils.randFloatSpread(20),
      THREE.MathUtils.randFloatSpread(20),
      THREE.MathUtils.randFloatSpread(20),
    ],
  }));

  onBeforeRender(object: THREE.InstancedMesh) {
    for (let i = 0; i < this.count; i++) {
      // Get current whereabouts of the instanced sphere
      object.getMatrixAt(i, mat);
      // Normalize the position and multiply by a negative force.
      // This is enough to drive it towards the center-point.
      this.sphereBody.api
        .at(i)
        .applyForce(vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-50).toArray(), [0, 0, 0]);
    }
  }
}

@Component({
  selector: 'scene',
  standalone: true,
  template: `
    <ngt-ambient-light intensity="0.25"></ngt-ambient-light>
    <ngt-spot-light [position]="[30, 30, 30]" intensity="1" angle="0.2" penumbra="1" castShadow>
      <ngt-vector2 [attach]="['shadow', 'mapSize']" [vector2]="[512, 512]"></ngt-vector2>
    </ngt-spot-light>
    <ngt-directional-light [position]="[-10, -10, -10]" intensity="5" color="purple"></ngt-directional-light>

    <ngt-physics [gravity]="[0, 2, 0]" iterations="10">
      <pointer></pointer>
      <clump></clump>
    </ngt-physics>

    <ngt-soba-environment files="assets/adamsbridge.hdr"></ngt-soba-environment>

    <ngt-effect-composer>
      <ngt-bloom-effect></ngt-bloom-effect>
    </ngt-effect-composer>

    <ngt-soba-sky></ngt-soba-sky>
  `,
  imports: [
    NgtAmbientLight,
    NgtSpotLight,
    NgtVector2Attribute,
    NgtDirectionalLight,
    NgtPhysics,
    NgtSobaEnvironment,
    NgtEffectComposer,
    NgtBloomEffect,
    NgtSobaSky,
    Pointer,
    Clump,
  ],
})
class Scene {}

@Component({
  selector: 'sandbox-object-clump',
  standalone: true,
  template: `
    <ngt-canvas shadows [dpr]="[1, 2]" [camera]="{ position: [0, 0, 20], fov: 35, near: 1, far: 40 }" initialLog>
      <scene></scene>
    </ngt-canvas>
  `,
  imports: [NgtCanvas, Scene],
})
export default class SandboxObjectClump {}
