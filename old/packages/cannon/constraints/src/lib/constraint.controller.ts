// GENERATED
import { ConstraintTypes, NgtPhysicsStore } from '@angular-three/cannon';
import {
  Controller,
  createControllerProviderFactory,
  makeId,
  NgtStore,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import {
  Directive,
  Inject,
  InjectionToken,
  Input,
  NgModule,
  NgZone,
  OnInit,
  Optional,
} from '@angular/core';
import * as THREE from 'three';

export const NGT_CANNON_CONSTRAINT_TYPE = new InjectionToken<
  'Hinge' | ConstraintTypes
>('Constraint type for Cannon');

export interface NgtCannonConstraintState {
  options: Record<string, unknown>;
  bodies: THREE.Object3D[];
}

@Directive({
  selector: `
    ng-container[ngtPhysicPointToPointConstraint],
    ng-container[ngtPhysicConeTwistConstraint],
    ng-container[ngtPhysicDistanceConstraint],
    ng-container[ngtPhysicHingeConstraint],
    ng-container[ngtPhysicLockConstraint]
  `,
  exportAs: 'ngtCannonConstraint',
  providers: [NgtStore],
})
export class NgtCannonConstraintController
  extends Controller
  implements OnInit
{
  @Input() set options(options: Record<string, unknown>) {
    this.store.set({ options });
  }

  private uuid = makeId();

  constructor(
    zone: NgZone,
    private store: NgtStore<NgtCannonConstraintState>,
    @Optional()
    @Inject(NGT_CANNON_CONSTRAINT_TYPE)
    private type: 'Hinge' | ConstraintTypes,
    private physicsStore: NgtPhysicsStore
  ) {
    super(zone);

    if (!type) {
      throw new Error('NGT_CANNON_CONSTRAINT_TYPE is required');
    }

    if (!physicsStore) {
      throw new Error(
        '[ngtCannon***Constraint] directive can only be used inside of <ngt-physics>'
      );
    }

    this.store.set({ options: {}, bodies: [] });
  }

  override ngOnInit() {
    super.ngOnInit();
    zonelessRequestAnimationFrame(() => {
      this.store.effect(this.store.select(), ({ bodies, options }) => {
        const worker = this.physicsStore.get('worker');
        const [bodyA, bodyB] = bodies;

        if (bodyA && bodyB) {
          worker.postMessage({
            op: 'addConstraint',
            props: [bodyA.uuid, bodyB.uuid, options],
            type: this.type,
            uuid: this.uuid,
          });
        }

        return () => {
          worker.postMessage({ op: 'removeConstraint', uuid: this.uuid });
        };
      });
    });
  }

  setBodies(body: THREE.Object3D) {
    this.store.set((state) => ({
      bodies: [...state.bodies, body],
    }));
  }

  get api() {
    const worker = this.physicsStore.get('worker');

    const enableDisable = {
      enable: () =>
        worker.postMessage({ op: 'enableConstraint', uuid: this.uuid }),
      disable: () =>
        worker.postMessage({ op: 'disableConstraint', uuid: this.uuid }),
    };

    if (this.type === 'Hinge') {
      return {
        ...enableDisable,
        enableMotor: () =>
          worker.postMessage({
            op: 'enableConstraintMotor',
            uuid: this.uuid,
          }),
        disableMotor: () =>
          worker.postMessage({
            op: 'disableConstraintMotor',
            uuid: this.uuid,
          }),
        setMotorSpeed: (value: number) =>
          worker.postMessage({
            op: 'setConstraintMotorSpeed',
            uuid: this.uuid,
            props: value,
          }),
        setMotorMaxForce: (value: number) =>
          worker.postMessage({
            op: 'setConstraintMotorMaxForce',
            uuid: this.uuid,
            props: value,
          }),
      };
    }

    return enableDisable;
  }
}

@NgModule({
  declarations: [NgtCannonConstraintController],
  exports: [NgtCannonConstraintController],
})
export class NgtCannonConstraintControllerModule {}

export const [
  NGT_CANNON_CONSTRAINT_WATCHED_CONTROLLER,
  NGT_CANNON_CONSTRAINT_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
  watchedControllerTokenName: 'Watched CannonConstraintController',
  controller: NgtCannonConstraintController,
});
