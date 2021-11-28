import {
  ContentChildren,
  Directive,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
} from '@angular/core';
import { MathUtils } from 'three';
import { NgtPhysicBody } from '../bodies/physic-body';
import { BodyProps } from '../models/body';
import { ConstraintTypes } from '../models/constraints';
import { PhysicsStore } from '../physics.store';

@Directive()
export abstract class NgtPhysicConstraint<
  TType extends 'Hinge' | ConstraintTypes
> implements OnChanges, OnInit, OnDestroy
{
  @Input() options?: Record<string, unknown> = {};

  protected physicsStore: PhysicsStore;
  protected uuid = MathUtils.generateUUID();

  protected abstract get type(): TType;

  @ContentChildren(NgtPhysicBody, { emitDistinctChangesOnly: true })
  bodies!: QueryList<NgtPhysicBody<BodyProps>>;

  constructor(
    protected ngZone: NgZone,
    @Optional() physicsStore?: PhysicsStore
  ) {
    if (!physicsStore) {
      throw new Error(
        '[ngtPhysicConstraint] directive can only be used inside of <ngt-physics>'
      );
    }
    this.physicsStore = physicsStore;
  }

  ngOnChanges() {
    this.remove();
    this.init();
  }

  ngOnInit() {
    this.init();
  }

  get api() {
    const { worker } = this.physicsStore.context;

    const enableDisable = {
      enable: () =>
        this.ngZone.runOutsideAngular(() =>
          worker.postMessage({ op: 'enableConstraint', uuid: this.uuid })
        ),
      disable: () =>
        this.ngZone.runOutsideAngular(() =>
          worker.postMessage({ op: 'disableConstraint', uuid: this.uuid })
        ),
    };

    if (this.type === 'Hinge') {
      return {
        ...enableDisable,
        enableMotor: () =>
          this.ngZone.runOutsideAngular(() =>
            worker.postMessage({ op: 'enableConstraintMotor', uuid: this.uuid })
          ),
        disableMotor: () =>
          this.ngZone.runOutsideAngular(() =>
            worker.postMessage({
              op: 'disableConstraintMotor',
              uuid: this.uuid,
            })
          ),
        setMotorSpeed: (value: number) =>
          this.ngZone.runOutsideAngular(() =>
            worker.postMessage({
              op: 'setConstraintMotorSpeed',
              uuid: this.uuid,
              props: value,
            })
          ),
        setMotorMaxForce: (value: number) =>
          this.ngZone.runOutsideAngular(() =>
            worker.postMessage({
              op: 'setConstraintMotorMaxForce',
              uuid: this.uuid,
              props: value,
            })
          ),
      };
    }

    return enableDisable;
  }

  private init() {
    this.ngZone.runOutsideAngular(() => {
      const { worker } = this.physicsStore.context;
      const [bodyA, bodyB] = this.bodies.toArray();

      if (bodyA?.object3d && bodyB?.object3d) {
        worker.postMessage({
          op: 'addConstraint',
          props: [bodyA.object3d.uuid, bodyB.object3d.uuid, this.options],
          type: this.type,
          uuid: this.uuid,
        });
      }
    });
  }

  private remove() {
    this.ngZone.runOutsideAngular(() => {
      const { worker } = this.physicsStore.context;
      worker.postMessage({ op: 'removeConstraint', uuid: this.uuid });
    });
  }

  ngOnDestroy() {
    this.remove();
  }
}
