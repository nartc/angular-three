// GENERATED
import {
  HingeConstraintOpts,
  NGT_PHYSIC_CONSTRAINT_CONTROLLER_PROVIDER,
  NGT_PHYSIC_CONSTRAINT_TYPE,
  NGT_PHYSIC_CONSTRAINT_WATCHED_CONTROLLER,
  NgtPhysicConstraintController,
  NgtPhysicConstraintControllerModule,
} from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';

@Directive({
  selector: 'ng-container[ngtPhysicHingeConstraint]',
  exportAs: 'ngtPhysicHingeConstraint',
  providers: [
    NGT_PHYSIC_CONSTRAINT_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_CONSTRAINT_TYPE, useValue: 'Hinge' },
  ],
})
export class NgtPhysicHingeConstraint {
  static ngAcceptInputType_options: HingeConstraintOpts | undefined;

  constructor(
    @Inject(NGT_PHYSIC_CONSTRAINT_WATCHED_CONTROLLER)
    private physicConstraintController: NgtPhysicConstraintController
  ) {}

  get api() {
    return this.physicConstraintController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicHingeConstraint],
  exports: [NgtPhysicHingeConstraint, NgtPhysicConstraintControllerModule],
})
export class NgtPhysicHingeConstraintModule {}
