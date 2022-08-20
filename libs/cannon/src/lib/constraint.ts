import { makeId, NgtComponentStore, NgtStore, Ref, tapEffect } from '@angular-three/core';
import { inject, Injectable, NgZone } from '@angular/core';
import {
  CannonWorkerAPI,
  ConeTwistConstraintOpts,
  ConstraintOptns,
  ConstraintTypes,
  DistanceConstraintOpts,
  HingeConstraintOpts,
  LockConstraintOpts,
  PointToPointConstraintOpts,
} from '@pmndrs/cannon-worker-api';
import { combineLatest, filter } from 'rxjs';
import * as THREE from 'three';
import { NgtPhysicsStore } from './physics.store';
import { NgtCannonUtils } from './utils';

type ConstraintApi = {
  disable: () => void;
  enable: () => void;
  remove: () => void;
};

type HingeConstraintApi = {
  disable: () => void;
  disableMotor: () => void;
  enable: () => void;
  enableMotor: () => void;
  setMotorMaxForce: (value: number) => void;
  setMotorSpeed: (value: number) => void;
  remove: () => void;
};

type NgtConstraintORHingeApi<T extends 'Hinge' | ConstraintTypes> = T extends ConstraintTypes
  ? ConstraintApi
  : HingeConstraintApi;

export interface NgtPhysicConstraintReturn<
  T extends 'Hinge' | ConstraintTypes,
  TObjectA extends THREE.Object3D = THREE.Object3D,
  TObjectB extends THREE.Object3D = THREE.Object3D
> {
  bodyA: Ref<TObjectA>;
  bodyB: Ref<TObjectB>;
  api: NgtConstraintORHingeApi<T>;
}


@Injectable()
export class NgtPhysicConstraint extends NgtComponentStore {
  private zone = inject(NgZone);
  private store = inject(NgtStore);
  private physicsStore = inject(NgtPhysicsStore, { optional: true });

  constructor() {
    super();
    if (!this.physicsStore) {
      throw new Error('NgtPhysicConstraint must be used inside of <ngt-physics>');
    }
  }

  usePointToPointConstraint<
    TObjectA extends THREE.Object3D = THREE.Object3D,
    TObjectB extends THREE.Object3D = THREE.Object3D
  >(bodyA: Ref<TObjectA>, bodyB: Ref<TObjectB>, optns: PointToPointConstraintOpts) {
    return this.useConstraint<'PointToPoint', TObjectA, TObjectB>('PointToPoint', bodyA, bodyB, optns);
  }

  useConeTwistConstraint<
    TObjectA extends THREE.Object3D = THREE.Object3D,
    TObjectB extends THREE.Object3D = THREE.Object3D
  >(bodyA: Ref<TObjectA>, bodyB: Ref<TObjectB>, optns: ConeTwistConstraintOpts) {
    return this.useConstraint<'ConeTwist', TObjectA, TObjectB>('ConeTwist', bodyA, bodyB, optns);
  }

  useDistanceConstraint<
    TObjectA extends THREE.Object3D = THREE.Object3D,
    TObjectB extends THREE.Object3D = THREE.Object3D
  >(bodyA: Ref<TObjectA>, bodyB: Ref<TObjectB>, optns: DistanceConstraintOpts) {
    return this.useConstraint<'Distance', TObjectA, TObjectB>('Distance', bodyA, bodyB, optns);
  }

  useHingeConstraint<
    TObjectA extends THREE.Object3D = THREE.Object3D,
    TObjectB extends THREE.Object3D = THREE.Object3D
  >(bodyA: Ref<TObjectA>, bodyB: Ref<TObjectB>, optns: HingeConstraintOpts) {
    return this.useConstraint<'Hinge', TObjectA, TObjectB>('Hinge', bodyA, bodyB, optns);
  }

  useLockConstraint<TObjectA extends THREE.Object3D = THREE.Object3D, TObjectB extends THREE.Object3D = THREE.Object3D>(
    bodyA: Ref<TObjectA>,
    bodyB: Ref<TObjectB>,
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
    bodyA: Ref<TObjectA>,
    bodyB: Ref<TObjectB>,
    opts: ConstraintOptns | HingeConstraintOpts = {},
    indexA: number = 0, 
    indexB: number = 0, 
  ): NgtPhysicConstraintReturn<TConstraintType, TObjectA, TObjectB> {
    return this.zone.runOutsideAngular(() => {
      const physicsStore = this.physicsStore;
      const uuid = makeId();

      this.store.onReady(() => {
        this.effect<[CannonWorkerAPI, TObjectA, TObjectB]>(
            tapEffect(([worker, a, b]) => {
            let auuid = a.uuid;
            let buuid = b.uuid;

            if (indexA || indexB) {
                let uuid = NgtCannonUtils.getUUID(bodyA, indexA);
                if (uuid) auuid = uuid;

                uuid = NgtCannonUtils.getUUID(bodyB, indexB);
                if (uuid) buuid = uuid;
            }

            worker.addConstraint({
              props: [auuid, buuid, opts],
              type,
              uuid,
            });
            return () => worker.removeConstraint({ uuid });
          })
        )(
          combineLatest([
            physicsStore!.select((s) => s.worker),
            bodyA.pipe(filter((ref) => ref != undefined)),
            bodyB.pipe(filter((ref) => ref != undefined)),
          ])
        );
      });

      return {
        bodyA,
        bodyB,
        get api() {
          const worker = physicsStore!.get((s) => s.worker);

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

    usePointToPointConstraintInst<
        TObjectA extends THREE.InstancedMesh = THREE.InstancedMesh,
        >(bodyA: Ref<TObjectA>, indexA: number, indexB: number, optns: PointToPointConstraintOpts) {
        return this.useConstraint<'PointToPoint', TObjectA, TObjectA>('PointToPoint', bodyA, bodyA, optns, indexA, indexB);
    }

    useConeTwistConstraintInst<
        TObjectA extends THREE.InstancedMesh = THREE.InstancedMesh,
        >(bodyA: Ref<TObjectA>, indexA: number, indexB: number, optns: ConeTwistConstraintOpts) {
        return this.useConstraint<'ConeTwist', TObjectA, TObjectA>('ConeTwist', bodyA, bodyA, optns, indexA, indexB);
    }

    useDistanceConstraintInst<
        TObjectA extends THREE.InstancedMesh = THREE.InstancedMesh,
        >(bodyA: Ref<TObjectA>, indexA: number, indexB: number, optns: DistanceConstraintOpts) {
        return this.useConstraint<'Distance', TObjectA, TObjectA>('Distance', bodyA, bodyA, optns, indexA, indexB);
    }

    useHingeConstraintInst<
        TObjectA extends THREE.InstancedMesh = THREE.InstancedMesh,
        >(bodyA: Ref<TObjectA>, indexA: number, indexB: number, optns: HingeConstraintOpts) {
        return this.useConstraint<'Hinge', TObjectA, TObjectA>('Hinge', bodyA, bodyA, optns, indexA, indexB);
    }

    useLockConstraintInst<
        TObjectA extends THREE.InstancedMesh = THREE.InstancedMesh,
        >(bodyA: Ref<TObjectA>, indexA: number, indexB: number, optns: LockConstraintOpts    ) {
        return this.useConstraint<'Lock', TObjectA, TObjectA>('Lock', bodyA, bodyA, optns, indexA, indexB);
    }

}
