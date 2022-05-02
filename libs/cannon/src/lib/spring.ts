import { makeId, NgtComponentStore, NgtStore, Ref, tapEffect } from '@angular-three/core';
import { Injectable, NgZone, Optional } from '@angular/core';
import type { CannonWorkerAPI, SpringOptns } from '@pmndrs/cannon-worker-api';
import { combineLatest, filter } from 'rxjs';
import * as THREE from 'three';
import { NgtPhysicsStore } from './physics.store';

export interface NgtPhysicSpringApi {
  setDamping: (value: number) => void;
  setRestLength: (value: number) => void;
  setStiffness: (value: number) => void;
  remove: () => void;
}

export interface NgtPhysicSpringReturn {
  bodyA: Ref<THREE.Object3D>;
  bodyB: Ref<THREE.Object3D>;
  api: NgtPhysicSpringApi;
}

@Injectable()
export class NgtPhysicSpring extends NgtComponentStore {
  constructor(private zone: NgZone, private store: NgtStore, @Optional() private physicsStore: NgtPhysicsStore) {
    if (!physicsStore) {
      throw new Error('NgtPhysicSpring must be used inside of <ngt-physics>');
    }

    super();
  }

  useSpring(bodyA: Ref<THREE.Object3D>, bodyB: Ref<THREE.Object3D>, optns: SpringOptns): NgtPhysicSpringReturn {
    return this.zone.runOutsideAngular(() => {
      const physicsStore = this.physicsStore;
      const uuid = makeId();

      this.onCanvasReady(this.store.ready$, () => {
        this.effect<[CannonWorkerAPI, THREE.Object3D, THREE.Object3D]>(
          tapEffect(([worker, a, b]) => {
            worker.addSpring({
              props: [a.uuid, b.uuid, optns],
              uuid,
            });

            return () => {
              worker.removeSpring({ uuid });
            };
          })
        )(
          combineLatest([
            physicsStore.select((s) => s.worker),
            bodyA.pipe(filter((ref) => ref != undefined)),
            bodyB.pipe(filter((ref) => ref != undefined)),
          ])
        );
      });

      return {
        bodyA,
        bodyB,
        get api() {
          const worker = physicsStore.get((s) => s.worker);
          return {
            setDamping: (value: number) => {
              worker.setSpringDamping({ props: value, uuid });
            },
            setRestLength: (value: number) => {
              worker.setSpringRestLength({ props: value, uuid });
            },
            setStiffness: (value: number) => {
              worker.setSpringStiffness({ props: value, uuid });
            },
            remove: () => {
              worker.removeSpring({ uuid });
            },
          };
        },
      };
    });
  }
}
