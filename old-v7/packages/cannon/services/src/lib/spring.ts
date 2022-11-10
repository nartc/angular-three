import { NgtPhysicsStore } from '@angular-three/cannon';
import { makeId, NgtComponentStore, NgtRef, NgtStore, tapEffect } from '@angular-three/core';
import { inject, Injectable, NgZone } from '@angular/core';
import type { SpringOptns } from '@pmndrs/cannon-worker-api';
import { filter } from 'rxjs';
import * as THREE from 'three';

export interface NgtPhysicsSpringApi {
  setDamping: (value: number) => void;
  setRestLength: (value: number) => void;
  setStiffness: (value: number) => void;
  remove: () => void;
}

export interface NgtPhysicsSpringReturn<
  TObjectA extends THREE.Object3D = THREE.Object3D,
  TObjectB extends THREE.Object3D = THREE.Object3D
> {
  bodyA: NgtRef<TObjectA>;
  bodyB: NgtRef<TObjectB>;
  api: NgtPhysicsSpringApi;
}

@Injectable()
export class NgtPhysicsSpring extends NgtComponentStore {
  private readonly zone = inject(NgZone);
  private readonly store = inject(NgtStore);
  private readonly physicsStore = inject(NgtPhysicsStore, { skipSelf: true });

  useSpring<TObjectA extends THREE.Object3D = THREE.Object3D, TObjectB extends THREE.Object3D = THREE.Object3D>(
    bodyA: NgtRef<TObjectA>,
    bodyB: NgtRef<TObjectB>,
    optns: SpringOptns
  ): NgtPhysicsSpringReturn<TObjectA, TObjectB> {
    return this.zone.runOutsideAngular(() => {
      const physicsStore = this.physicsStore;
      const uuid = makeId();

      this.store.onReady(() => {
        this.effect(
          tapEffect(() => {
            const worker = physicsStore.getState((s) => s.worker);
            const a = bodyA.value;
            const b = bodyB.value;
            worker.addSpring({
              props: [a.uuid, b.uuid, optns],
              uuid,
            });

            return () => {
              worker.removeSpring({ uuid });
            };
          })
        )(
          this.select(
            physicsStore.select((s) => s.worker),
            bodyA.pipe(filter((ref) => ref != undefined)),
            bodyB.pipe(filter((ref) => ref != undefined)),
            this.defaultProjector
          )
        );
      });

      return {
        bodyA,
        bodyB,
        get api() {
          const worker = physicsStore.getState((s) => s.worker);
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
