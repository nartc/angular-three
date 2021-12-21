// GENERATED
import {
  Controller,
  createControllerProviderFactory,
} from '@angular-three/core';
import { Directive, Input, NgModule, NgZone, OnInit } from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk';
import { NgtPhysicConstraintStore } from './constraint.store';

@Directive({
  selector: `
    ng-container[ngtPhysicPointToPointConstraint],
    ng-container[ngtPhysicConeTwistConstraint],
    ng-container[ngtPhysicDistanceConstraint],
    ng-container[ngtPhysicHingeConstraint],
    ng-container[ngtPhysicLockConstraint]
  `,
  exportAs: 'ngtPhysicsConstraintController',
  providers: [NgtPhysicConstraintStore],
})
export class NgtPhysicConstraintController
  extends Controller
  implements OnInit
{
  @Input() set options(v: Record<string, unknown>) {
    this.physicConstraintStore.set({ options: v });
  }

  constructor(
    ngZone: NgZone,
    private physicConstraintStore: NgtPhysicConstraintStore
  ) {
    super(ngZone);
  }

  ngOnInit() {
    super.ngOnInit();
    requestAnimationFrame(() => {
      this.physicConstraintStore.actions.init();
    });
  }

  get api() {
    return this.physicConstraintStore.api;
  }

  get controller(): Controller | undefined {
    return undefined;
  }

  get props(): string[] {
    return [];
  }
}

@NgModule({
  declarations: [NgtPhysicConstraintController],
  exports: [NgtPhysicConstraintController],
})
export class NgtPhysicConstraintControllerModule {}

export const [
  NGT_PHYSIC_CONSTRAINT_WATCHED_CONTROLLER,
  NGT_PHYSIC_CONSTRAINT_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
  watchedControllerTokenName: 'Watched PhysicConstraintController',
  controller: NgtPhysicConstraintController,
});
