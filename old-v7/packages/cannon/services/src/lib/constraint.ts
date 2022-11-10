import { NgtPhysicsStore } from '@angular-three/cannon';
import { makeId, NgtComponentStore, NgtRef, NgtStore, tapEffect } from '@angular-three/core';
import { inject, Injectable, NgZone } from '@angular/core';
import {
  ConeTwistConstraintOpts,
  ConstraintOptns,
  ConstraintTypes,
  DistanceConstraintOpts,
  HingeConstraintOpts,
  LockConstraintOpts,
  PointToPointConstraintOpts,
} from '@pmndrs/cannon-worker-api';
import { filter } from 'rxjs';
import * as THREE from 'three';

export type NgtConstraintApi = {
  disable: () => void;
  enable: () => void;
  remove: () => void;
};

export type NgtHingeConstraintApi = {
  disable: () => void;
  disableMotor: () => void;
  enable: () => void;
  enableMotor: () => void;
  setMotorMaxForce: (value: number) => void;
  setMotorSpeed: (value: number) => void;
  remove: () => void;
};

export type NgtConstraintORHingeApi<T extends 'Hinge' | ConstraintTypes> = T extends ConstraintTypes
  ? NgtConstraintApi
  : NgtHingeConstraintApi;

export interface NgtPhysicsConstraintReturn<
  T extends 'Hinge' | ConstraintTypes,
  TObjectA extends THREE.Object3D = THREE.Object3D,
  TObjectB extends THREE.Object3D = THREE.Object3D
> {
  bodyA: NgtRef<TObjectA>;
  bodyB: NgtRef<TObjectB>;
  api: NgtConstraintORHingeApi<T>;
}

@Injectable()
export class NgtPhysicsConstraint extends NgtComponentStore {
  private readonly zone = inject(NgZone);
  private readonly store = inject(NgtStore);
  private readonly physicsStore = inject(NgtPhysicsStore, { skipSelf: true });

  usePointToPointConstraint<
    TObjectA extends THREE.Object3D = THREE.Object3D,
    TObjectB extends THREE.Object3D = THREE.Object3D
  >(bodyA: NgtRef<TObjectA>, bodyB: NgtRef<TObjectB>, optns: PointToPointConstraintOpts) {
    return this.useConstraint<'PointToPoint', TObjectA, TObjectB>('PointToPoint', bodyA, bodyB, optns);
  }

  useConeTwistConstraint<
    TObjectA extends THREE.Object3D = THREE.Object3D,
    TObjectB extends THREE.Object3D = THREE.Object3D
  >(bodyA: NgtRef<TObjectA>, bodyB: NgtRef<TObjectB>, optns: ConeTwistConstraintOpts) {
    return this.useConstraint<'ConeTwist', TObjectA, TObjectB>('ConeTwist', bodyA, bodyB, optns);
  }

  useDistanceConstraint<
    TObjectA extends THREE.Object3D = THREE.Object3D,
    TObjectB extends THREE.Object3D = THREE.Object3D
  >(bodyA: NgtRef<TObjectA>, bodyB: NgtRef<TObjectB>, optns: DistanceConstraintOpts) {
    return this.useConstraint<'Distance', TObjectA, TObjectB>('Distance', bodyA, bodyB, optns);
  }

  useHingeConstraint<
    TObjectA extends THREE.Object3D = THREE.Object3D,
    TObjectB extends THREE.Object3D = THREE.Object3D
  >(bodyA: NgtRef<TObjectA>, bodyB: NgtRef<TObjectB>, optns: HingeConstraintOpts) {
    return this.useConstraint<'Hinge', TObjectA, TObjectB>('Hinge', bodyA, bodyB, optns);
  }

  useLockConstraint<TObjectA extends THREE.Object3D = THREE.Object3D, TObjectB extends THREE.Object3D = THREE.Object3D>(
    bodyA: NgtRef<TObjectA>,
    bodyB: NgtRef<TObjectB>,
    optns: LockConstraintOpts
  ) {
    return this.useConstraint<'Lock', TObjectA, TObjectB>('Lock', bodyA, bodyB, optns);
  }

  private useConstraint<
    TConstraintType extends 'Hinge' | ConstraintTypes,
    TObjectA extends THREE.Object3D = THREE.Object3D,
    TObjectB extends THREE.Object3D = THREE.Object3D
  >(
    type: TConstraintType,
    bodyA: NgtRef<TObjectA>,
    bodyB: NgtRef<TObjectB>,
    opts: ConstraintOptns | HingeConstraintOpts = {}
  ): NgtPhysicsConstraintReturn<TConstraintType, TObjectA, TObjectB> {
    return this.zone.runOutsideAngular(() => {
      const physicsStore = this.physicsStore;
      const uuid = makeId();

      this.store.onReady(() => {
        this.effect(
          tapEffect(() => {
            const worker = physicsStore.getState((s) => s.worker);
            const a = bodyA.value;
            const b = bodyB.value;

            worker.addConstraint({
              props: [a.uuid, b.uuid, opts],
              type,
              uuid,
            });

            return () => worker.removeConstraint({ uuid });
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

          const commonApi = {
            disable: () => {
              worker.disableConstraint({ uuid });
            },
            enable: () => {
              worker.enableConstraint({ uuid });
            },
            remove: () => {
              worker.removeConstraint({ uuid });
            },
          } as NgtConstraintORHingeApi<TConstraintType>;

          if (type === 'Hinge') {
            return {
              ...commonApi,
              disableMotor: () => {
                worker.disableConstraintMotor({ uuid });
              },
              enableMotor: () => {
                worker.enableConstraintMotor({ uuid });
              },
              setMotorMaxForce: (value: number) => {
                worker.setConstraintMotorMaxForce({
                  props: value,
                  uuid,
                });
              },
              setMotorSpeed: (value: number) => {
                worker.setConstraintMotorSpeed({
                  props: value,
                  uuid,
                });
              },
            };
          }

          return commonApi;
        },
      };
    });
  }
}
