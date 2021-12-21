// GENERATED
import {
  PointToPointConstraintOpts,
  NGT_PHYSIC_CONSTRAINT_CONTROLLER_PROVIDER,
  NGT_PHYSIC_CONSTRAINT_TYPE,
  NGT_PHYSIC_CONSTRAINT_WATCHED_CONTROLLER,
  NgtPhysicConstraintController,
  NgtPhysicConstraintControllerModule,
} from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';

@Directive({
  selector: 'ng-container[ngtPhysicPointToPointConstraint]',
  exportAs: 'ngtPhysicPointToPointConstraint',
  providers: [
    NGT_PHYSIC_CONSTRAINT_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_CONSTRAINT_TYPE, useValue: 'PointToPoint' },
  ],
})
export class NgtPhysicPointToPointConstraint {
  static ngAcceptInputType_options: PointToPointConstraintOpts | undefined;

  constructor(
    @Inject(NGT_PHYSIC_CONSTRAINT_WATCHED_CONTROLLER)
    private physicConstraintController: NgtPhysicConstraintController
  ) {}

  get api() {
    return this.physicConstraintController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicPointToPointConstraint],
  exports: [
    NgtPhysicPointToPointConstraint,
    NgtPhysicConstraintControllerModule,
  ],
})
export class NgtPhysicPointToPointConstraintModule {}
