import { EnhancedRxState, NgtAnimationFrameStore } from '@angular-three/core';
import { Injectable } from '@angular/core';
import { Vec3 } from 'cannon-es';
import cannonDebugger from 'cannon-es-debugger';
import { Quaternion as CQuaternion } from 'math/Quaternion';
import * as THREE from 'three';
import { World } from 'world/World';
import { BodyProps, BodyShapeType } from '../models/body';
import { NgtPhysicsStore } from '../physics.store';
// @ts-ignore
import propsToBody from '../utils/props-to-body';
import { NgtCannonDebugApi, NgtCannonDebugStoreState } from './models/debug';

const v = new THREE.Vector3();
const s = new THREE.Vector3(1, 1, 1);
const q = new THREE.Quaternion();

@Injectable()
export class NgtCannonDebugStore extends EnhancedRxState<
  NgtCannonDebugStoreState,
  { init: void }
> {
  #scene = new THREE.Scene();
  actions = this.create();

  constructor(
    physicsStore: NgtPhysicsStore,
    animationFrameStore: NgtAnimationFrameStore
  ) {
    super();

    if (!physicsStore) {
      throw new Error('ngt-cannon-debug must be used within ngt-physics');
    }

    this.set({
      color: 'black',
      scale: 1,
      impl: cannonDebugger,
      bodies: [],
      refs: {},
    });

    this.holdEffect(this.actions.init$, () => {
      let instance: NgtCannonDebugApi;
      let lastBodies = 0;

      const animationUuid = animationFrameStore.register({
        callback: () => {
          const { bodies, refs, impl, color, scale } = this.get();
          const { refs: physicsRefs } = physicsStore.get();

          if (!instance || lastBodies !== bodies.length) {
            lastBodies = bodies.length;
            this.#scene.children = [];
            instance = impl!(this.#scene, { bodies } as World, {
              color: color as THREE.ColorRepresentation,
              scale,
            });
          }

          for (const uuid in refs) {
            physicsRefs[uuid].matrix.decompose(v, q, s);
            refs[uuid].position.copy(v as unknown as Vec3);
            refs[uuid].quaternion.copy(q as unknown as CQuaternion);
          }

          instance.update();
        },
      });

      return () => {
        animationFrameStore.actions.unsubscriberUuid(animationUuid);
      };
    });
  }

  get scene() {
    return this.#scene;
  }

  get api() {
    const { bodies, refs } = this.get();
    return {
      add(id: string, props: BodyProps, type: BodyShapeType) {
        const body = propsToBody(id, props, type);
        bodies.push(body);
        refs[id] = body;
      },
      remove(id: string) {
        const debugBodyIndex = bodies.indexOf(refs[id]);
        if (debugBodyIndex > -1) bodies.splice(debugBodyIndex, 1);
        delete refs[id];
      },
    };
  }
}
