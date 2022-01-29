// GENERATED
import {
  LockConstraintOpts,
  NGT_PHYSIC_CONSTRAINT_CONTROLLER_PROVIDER,
  NGT_PHYSIC_CONSTRAINT_TYPE,
  NGT_PHYSIC_CONSTRAINT_WATCHED_CONTROLLER,
  NgtPhysicConstraintController,
  NgtPhysicConstraintControllerModule,
} from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';

@Directive({
  selector: 'ng-container[ngtPhysicLockConstraint]',
  exportAs: 'ngtPhysicLockConstraint',
  providers: [
    NGT_PHYSIC_CONSTRAINT_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_CONSTRAINT_TYPE, useValue: 'Lock' },
  ],
})
export class NgtPhysicLockConstraint {
  static ngAcceptInputType_options: LockConstraintOpts | undefined;

  constructor(
    @Inject(NGT_PHYSIC_CONSTRAINT_WATCHED_CONTROLLER)
    private physicConstraintController: NgtPhysicConstraintController
  ) {}

  get api() {
    return this.physicConstraintController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicLockConstraint],
  exports: [NgtPhysicLockConstraint, NgtPhysicConstraintControllerModule],
})
export class NgtPhysicLockConstraintModule {}
