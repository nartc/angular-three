// GENERATED
import { LockConstraintOpts } from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';
import {
  NGT_CANNON_CONSTRAINT_CONTROLLER_PROVIDER,
  NGT_CANNON_CONSTRAINT_TYPE,
  NGT_CANNON_CONSTRAINT_WATCHED_CONTROLLER,
  NgtCannonConstraintController,
  NgtCannonConstraintControllerModule,
} from '../constraint.controller';

@Directive({
  selector: 'ng-container[ngtPhysicLockConstraint]',
  exportAs: 'ngtPhysicLockConstraint',
  providers: [
    NGT_CANNON_CONSTRAINT_CONTROLLER_PROVIDER,
    { provide: NGT_CANNON_CONSTRAINT_TYPE, useValue: 'Lock' },
  ],
})
export class NgtPhysicLockConstraint {
  static ngAcceptInputType_options: LockConstraintOpts | undefined;

  constructor(
    @Inject(NGT_CANNON_CONSTRAINT_WATCHED_CONTROLLER)
    private cannonConstraintController: NgtCannonConstraintController
  ) {}

  get api() {
    return this.cannonConstraintController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicLockConstraint],
  exports: [NgtPhysicLockConstraint, NgtCannonConstraintControllerModule],
})
export class NgtPhysicLockConstraintModule {}
