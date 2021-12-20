import { EnhancedRxState } from '@angular-three/core';
import { Inject, Injectable, Optional } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import * as THREE from 'three';
import { NgtPhysicBodyController } from '../body/body.controller';
import { ConstraintTypes } from '../models/constraints';
import { NgtPhysicsStore } from '../physics.store';
import { NGT_PHYSIC_CONSTRAINT_TYPE } from './tokens';

export interface NgtPhysicConstraintStoreState {
  options: Record<string, unknown>;
  bodies: NgtPhysicBodyController[];
}

@Injectable()
export class NgtPhysicConstraintStore extends EnhancedRxState<
  NgtPhysicConstraintStoreState,
  { init: void }
> {
  #uuid = THREE.MathUtils.generateUUID();
  actions = this.create();

  #addConstraintChanges$ = combineLatest([
    this.actions.init$,
    this.select(),
  ]).pipe(map(([, state]) => state));

  constructor(
    @Optional()
    @Inject(NGT_PHYSIC_CONSTRAINT_TYPE)
    private type: 'Hinge' | ConstraintTypes,
    private physicsStore: NgtPhysicsStore
  ) {
    super();
    if (!type) {
      throw new Error('NGT_PHYSIC_CONSTRAINT_TYPE is required');
    }

    if (!physicsStore) {
      throw new Error(
        '[ngtPhysic***Constraint] directive can only be used inside of <ngt-physics>'
      );
    }
    this.set({ options: {}, bodies: [] });
    this.holdEffect(this.#addConstraintChanges$, ({ options, bodies }) => {
      const worker = this.physicsStore.get('worker');
      const [bodyA, bodyB] = bodies;

      if (bodyA?.object3d && bodyB?.object3d) {
        worker.postMessage({
          op: 'addConstraint',
          props: [bodyA.object3d.uuid, bodyB.object3d.uuid, options],
          type: this.type,
          uuid: this.#uuid,
        });
      }

      return () => {
        worker.postMessage({ op: 'removeConstraint', uuid: this.#uuid });
      };
    });
  }

  get api() {
    const worker = this.physicsStore.get('worker');

    const enableDisable = {
      enable: () =>
        worker.postMessage({ op: 'enableConstraint', uuid: this.#uuid }),
      disable: () =>
        worker.postMessage({ op: 'disableConstraint', uuid: this.#uuid }),
    };

    if (this.type === 'Hinge') {
      return {
        ...enableDisable,
        enableMotor: () =>
          worker.postMessage({
            op: 'enableConstraintMotor',
            uuid: this.#uuid,
          }),
        disableMotor: () =>
          worker.postMessage({
            op: 'disableConstraintMotor',
            uuid: this.#uuid,
          }),
        setMotorSpeed: (value: number) =>
          worker.postMessage({
            op: 'setConstraintMotorSpeed',
            uuid: this.#uuid,
            props: value,
          }),
        setMotorMaxForce: (value: number) =>
          worker.postMessage({
            op: 'setConstraintMotorMaxForce',
            uuid: this.#uuid,
            props: value,
          }),
      };
    }

    return enableDisable;
  }
}
