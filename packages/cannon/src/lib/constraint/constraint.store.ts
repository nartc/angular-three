import { EnhancedComponentStore, tapEffect } from '@angular-three/core';
import { Inject, Injectable, NgZone, Optional } from '@angular/core';
import { tap, withLatestFrom } from 'rxjs';
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
export class NgtPhysicConstraintStore extends EnhancedComponentStore<NgtPhysicConstraintStoreState> {
  #uuid = THREE.MathUtils.generateUUID();

  constructor(
    @Optional()
    @Inject(NGT_PHYSIC_CONSTRAINT_TYPE)
    private type: 'Hinge' | ConstraintTypes,
    private physicsStore: NgtPhysicsStore,
    private ngZone: NgZone
  ) {
    super({
      options: {},
      bodies: [],
    });

    if (!type) {
      throw new Error('NGT_PHYSIC_CONSTRAINT_TYPE is required');
    }

    if (!physicsStore) {
      throw new Error(
        '[ngtPhysic***Constraint] directive can only be used inside of <ngt-physics>'
      );
    }
  }

  readonly init = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.#initConstraint();
      })
    )
  );

  #initConstraint = this.effect(($) =>
    $.pipe(
      withLatestFrom(this.selectors.bodies$, this.selectors.options$),
      tapEffect(([, bodies, options]) => {
        const { worker } = this.physicsStore.getImperativeState();
        const [bodyA, bodyB] = bodies;

        this.ngZone.runOutsideAngular(() => {
          if (bodyA?.object3d && bodyB?.object3d) {
            worker.postMessage({
              op: 'addConstraint',
              props: [bodyA.object3d.uuid, bodyB.object3d.uuid, options],
              type: this.type,
              uuid: this.#uuid,
            });
          }
        });

        return () => {
          worker.postMessage({ op: 'removeConstraint', uuid: this.#uuid });
        };
      })
    )
  );

  get api() {
    const { worker } = this.physicsStore.getImperativeState();

    const enableDisable = {
      enable: () =>
        this.ngZone.runOutsideAngular(() =>
          worker.postMessage({ op: 'enableConstraint', uuid: this.#uuid })
        ),
      disable: () =>
        this.ngZone.runOutsideAngular(() =>
          worker.postMessage({ op: 'disableConstraint', uuid: this.#uuid })
        ),
    };

    if (this.type === 'Hinge') {
      return {
        ...enableDisable,
        enableMotor: () =>
          this.ngZone.runOutsideAngular(() =>
            worker.postMessage({
              op: 'enableConstraintMotor',
              uuid: this.#uuid,
            })
          ),
        disableMotor: () =>
          this.ngZone.runOutsideAngular(() =>
            worker.postMessage({
              op: 'disableConstraintMotor',
              uuid: this.#uuid,
            })
          ),
        setMotorSpeed: (value: number) =>
          this.ngZone.runOutsideAngular(() =>
            worker.postMessage({
              op: 'setConstraintMotorSpeed',
              uuid: this.#uuid,
              props: value,
            })
          ),
        setMotorMaxForce: (value: number) =>
          this.ngZone.runOutsideAngular(() =>
            worker.postMessage({
              op: 'setConstraintMotorMaxForce',
              uuid: this.#uuid,
              props: value,
            })
          ),
      };
    }

    return enableDisable;
  }
}
