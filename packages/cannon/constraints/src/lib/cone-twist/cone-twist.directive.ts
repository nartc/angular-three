// GENERATED
import {
  ConeTwistConstraintOpts,
  NGT_PHYSIC_CONSTRAINT_CONTROLLER_PROVIDER,
  NGT_PHYSIC_CONSTRAINT_TYPE,
  NGT_PHYSIC_CONSTRAINT_WATCHED_CONTROLLER,
  NgtPhysicConstraintController,
  NgtPhysicConstraintControllerModule,
} from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';

@Directive({
  selector: 'ng-container[ngtPhysicConeTwistConstraint]',
  exportAs: 'ngtPhysicConeTwistConstraint',
  providers: [
    NGT_PHYSIC_CONSTRAINT_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_CONSTRAINT_TYPE, useValue: 'ConeTwist' },
  ],
})
export class NgtPhysicConeTwistConstraint {
  static ngAcceptInputType_options: ConeTwistConstraintOpts | undefined;

  constructor(
    @Inject(NGT_PHYSIC_CONSTRAINT_WATCHED_CONTROLLER)
    private physicConstraintController: NgtPhysicConstraintController
  ) {}

  get api() {
    return this.physicConstraintController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicConeTwistConstraint],
  exports: [NgtPhysicConeTwistConstraint, NgtPhysicConstraintControllerModule],
})
export class NgtPhysicConeTwistConstraintModule {}
