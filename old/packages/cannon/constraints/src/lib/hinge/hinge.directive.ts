// GENERATED
import { HingeConstraintOpts } from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';
import {
  NGT_CANNON_CONSTRAINT_CONTROLLER_PROVIDER,
  NGT_CANNON_CONSTRAINT_TYPE,
  NGT_CANNON_CONSTRAINT_WATCHED_CONTROLLER,
  NgtCannonConstraintController,
  NgtCannonConstraintControllerModule,
} from '../constraint.controller';

@Directive({
  selector: 'ng-container[ngtPhysicHingeConstraint]',
  exportAs: 'ngtPhysicHingeConstraint',
  providers: [
    NGT_CANNON_CONSTRAINT_CONTROLLER_PROVIDER,
    { provide: NGT_CANNON_CONSTRAINT_TYPE, useValue: 'Hinge' },
  ],
})
export class NgtPhysicHingeConstraint {
  static ngAcceptInputType_options: HingeConstraintOpts | undefined;

  constructor(
    @Inject(NGT_CANNON_CONSTRAINT_WATCHED_CONTROLLER)
    private cannonConstraintController: NgtCannonConstraintController
  ) {}

  get api() {
    return this.cannonConstraintController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicHingeConstraint],
  exports: [NgtPhysicHingeConstraint, NgtCannonConstraintControllerModule],
})
export class NgtPhysicHingeConstraintModule {}
