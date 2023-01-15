import { NgtcPhysics } from '@angular-three/cannon';
import { injectSphere } from '@angular-three/cannon/services';
import { extend, injectNgtStore, NgtArgs, NgtPush } from '@angular-three/core';
import { NgtpEffectComposer } from '@angular-three/postprocessing';
import { NgtpBloom } from '@angular-three/postprocessing/effects';
import { injectNgtsTextureLoader } from '@angular-three/soba/loaders';
import { NgtsEnvironment, NgtsSky } from '@angular-three/soba/staging';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Directive, OnDestroy, OnInit } from '@angular/core';
import {
  AmbientLight,
  DirectionalLight,
  InstancedMesh,
  MathUtils,
  Matrix4,
  MeshStandardMaterial,
  SphereGeometry,
  SpotLight,
  Vector2,
  Vector3,
} from 'three';

extend({
  InstancedMesh,
  MeshStandardMaterial,
  SphereGeometry,
  DirectionalLight,
  AmbientLight,
  SpotLight,
  Vector2,
});

@Directive({
  selector: 'sandbox-pointer',
  standalone: true,
})
export class Pointer implements OnInit, OnDestroy {
  readonly #store = injectNgtStore();

  readonly pointerBody = injectSphere(() => ({
    type: 'Kinematic',
    args: [3],
    position: [0, 0, 0],
  }));

  #unsub?: () => void;

  ngOnInit() {
    this.#unsub = this.#store.get('internal').subscribe(({ pointer, viewport }) => {
      this.pointerBody.api.position.set(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      );
    });
  }

  ngOnDestroy() {
    this.#unsub?.();
  }
}

const mat = new Matrix4();
const vec = new Vector3();

@Component({
  selector: 'sandbox-clump',
  standalone: true,
  template: `
    <ngt-instanced-mesh
      *args="[undefined, undefined, count]"
      [ref]="sphereBody.ref"
      castShadow
      receiveShadow
      (beforeRender)="onBeforeRender($any($event).object)"
    >
      <ngt-sphere-geometry *args="[1, 32, 32]" />
      <ngt-mesh-standard-material
        color="red"
        roughness="0"
        envMapIntensity="0.2"
        emissive="#370037"
        [map]="texture$ | ngtPush : null"
      />
    </ngt-instanced-mesh>
  `,
  imports: [NgtArgs, NgtPush],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Clump {
  readonly count = 40;
  readonly texture$ = injectNgtsTextureLoader('assets/cross.jpg');

  readonly sphereBody = injectSphere<THREE.InstancedMesh>(() => ({
    args: [1],
    mass: 1,
    angularDamping: 0.1,
    linearDamping: 0.65,
    position: [
      MathUtils.randFloatSpread(20),
      MathUtils.randFloatSpread(20),
      MathUtils.randFloatSpread(20),
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
        .applyForce(
          vec.setFromMatrixPosition(mat).normalize().multiplyScalar(-50).toArray(),
          [0, 0, 0]
        );
    }
  }
}

@Component({
  selector: 'sandbox-object-clump-scene',
  standalone: true,
  template: `
    <ngt-ambient-light intensity="0.25" />
    <ngt-spot-light [position]="30" intensity="1" angle="0.2" penumbra="1" castShadow>
      <ngt-vector2 attach="shadow.mapSize" *args="[512, 512]" />
    </ngt-spot-light>
    <ngt-directional-light [position]="-10" intensity="5" color="purple" />

    <ngtc-physics [gravity]="[0, 2, 0]" [iterations]="10">
      <sandbox-pointer />
      <sandbox-clump />
    </ngtc-physics>

    <ngts-environment files="assets/adamsbridge.hdr" />

    <ngtp-effect-composer>
      <ngtp-bloom />
    </ngtp-effect-composer>

    <ngts-sky />
  `,
  imports: [
    NgtArgs,
    NgtcPhysics,
    NgtsEnvironment,
    NgtsSky,
    NgtpEffectComposer,
    NgtpBloom,
    Clump,
    Pointer,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}
