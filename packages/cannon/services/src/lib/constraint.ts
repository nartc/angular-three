import { injectNgtcStore } from '@angular-three/cannon';
import { makeId, NgtInjectedRef } from '@angular-three/core';
import {
  ConeTwistConstraintOpts,
  ConstraintOptns,
  ConstraintTypes,
  DistanceConstraintOpts,
  HingeConstraintOpts,
  LockConstraintOpts,
  PointToPointConstraintOpts,
} from '@pmndrs/cannon-worker-api';
import { combineLatest } from 'rxjs';

export interface NgtcConstraintApi {
  disable: () => void;
  enable: () => void;
  remove: () => void;
}

export interface NgtHingeConstraintApi extends NgtcConstraintApi {
  disableMotor: () => void;
  enableMotor: () => void;
  setMotorMaxForce: (value: number) => void;
  setMotorSpeed: (value: number) => void;
}

export type NgtcConstraintORHingeApi<T extends 'Hinge' | ConstraintTypes> =
  T extends ConstraintTypes ? NgtcConstraintApi : NgtHingeConstraintApi;

export interface NgtcConstraintReturn<
  T extends 'Hinge' | ConstraintTypes,
  TObjectA extends THREE.Object3D = THREE.Object3D,
  TObjectB extends THREE.Object3D = THREE.Object3D
> {
  bodyA: NgtInjectedRef<TObjectA>;
  bodyB: NgtInjectedRef<TObjectB>;
  api: NgtcConstraintORHingeApi<T>;
}

export function injectPointToPointConstraint<
  TObjectA extends THREE.Object3D = THREE.Object3D,
  TObjectB extends THREE.Object3D = THREE.Object3D
>(
  bodyA: NgtInjectedRef<TObjectA>,
  bodyB: NgtInjectedRef<TObjectB>,
  opts: PointToPointConstraintOpts
) {
  return injectConstraint('PointToPoint', bodyA, bodyB, opts);
}

export function injectConeTwistConstraint<
  TObjectA extends THREE.Object3D = THREE.Object3D,
  TObjectB extends THREE.Object3D = THREE.Object3D
>(bodyA: NgtInjectedRef<TObjectA>, bodyB: NgtInjectedRef<TObjectB>, opts: ConeTwistConstraintOpts) {
  return injectConstraint('ConeTwist', bodyA, bodyB, opts);
}

export function injectDistanceConstraint<
  TObjectA extends THREE.Object3D = THREE.Object3D,
  TObjectB extends THREE.Object3D = THREE.Object3D
>(bodyA: NgtInjectedRef<TObjectA>, bodyB: NgtInjectedRef<TObjectB>, opts: DistanceConstraintOpts) {
  return injectConstraint('Distance', bodyA, bodyB, opts);
}

export function injectHingeConstraint<
  TObjectA extends THREE.Object3D = THREE.Object3D,
  TObjectB extends THREE.Object3D = THREE.Object3D
>(bodyA: NgtInjectedRef<TObjectA>, bodyB: NgtInjectedRef<TObjectB>, opts: HingeConstraintOpts) {
  return injectConstraint('Hinge', bodyA, bodyB, opts);
}

export function injectLockConstraint<
  TObjectA extends THREE.Object3D = THREE.Object3D,
  TObjectB extends THREE.Object3D = THREE.Object3D
>(bodyA: NgtInjectedRef<TObjectA>, bodyB: NgtInjectedRef<TObjectB>, opts: LockConstraintOpts) {
  return injectConstraint('Lock', bodyA, bodyB, opts);
}

function injectConstraint<
  TConstraintType extends 'Hinge' | ConstraintTypes,
  TObjectA extends THREE.Object3D = THREE.Object3D,
  TObjectB extends THREE.Object3D = THREE.Object3D,
  TOptions extends HingeConstraintOpts | ConstraintOptns = TConstraintType extends 'Hinge'
    ? HingeConstraintOpts
    : ConstraintOptns
>(
  type: TConstraintType,
  bodyA: NgtInjectedRef<TObjectA>,
  bodyB: NgtInjectedRef<TObjectB>,
  opts: TOptions = {} as TOptions
): NgtcConstraintReturn<TConstraintType, TObjectA, TObjectB> {
  const uuid = makeId();
  const store = injectNgtcStore({ skipSelf: true });

  store.effect(
    combineLatest([store.select('worker'), bodyA.$, bodyB.$]),
    ([worker, bodyA, bodyB]) => {
      worker.addConstraint({
        props: [bodyA.uuid, bodyB.uuid, opts],
        type,
        uuid,
      });

      return () => worker.removeConstraint({ uuid });
    }
  );

  const api = {
    disable: () => {
      const worker = store.get('worker');
      worker.disableConstraint({ uuid });
    },
    enable: () => {
      const worker = store.get('worker');
      worker.enableConstraint({ uuid });
    },
    remove: () => {
      const worker = store.get('worker');
      worker.removeConstraint({ uuid });
    },
  } as NgtcConstraintORHingeApi<TConstraintType>;

  if (type === 'Hinge') {
    (api as NgtHingeConstraintApi).disableMotor = () => {
      const worker = store.get('worker');
      worker.disableConstraintMotor({ uuid });
    };

    (api as NgtHingeConstraintApi).enableMotor = () => {
      const worker = store.get('worker');
      worker.enableConstraintMotor({ uuid });
    };

    (api as NgtHingeConstraintApi).setMotorSpeed = (value: number) => {
      const worker = store.get('worker');
      worker.setConstraintMotorSpeed({ uuid, props: value });
    };

    (api as NgtHingeConstraintApi).setMotorMaxForce = (value: number) => {
      const worker = store.get('worker');
      worker.setConstraintMotorMaxForce({ uuid, props: value });
    };
  }

  return { bodyA, bodyB, api };
}
