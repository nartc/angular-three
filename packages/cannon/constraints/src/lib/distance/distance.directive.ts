// GENERATED
import {
  DistanceConstraintOpts,
  NGT_PHYSIC_CONSTRAINT_CONTROLLER_PROVIDER,
  NGT_PHYSIC_CONSTRAINT_TYPE,
  NGT_PHYSIC_CONSTRAINT_WATCHED_CONTROLLER,
  NgtPhysicConstraintController,
  NgtPhysicConstraintControllerModule,
} from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';

@Directive({
  selector: 'ng-container[ngtPhysicDistanceConstraint]',
  exportAs: 'ngtPhysicDistanceConstraint',
  providers: [
    NGT_PHYSIC_CONSTRAINT_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_CONSTRAINT_TYPE, useValue: 'Distance' },
  ],
})
export class NgtPhysicDistanceConstraint {
  static ngAcceptInputType_options: DistanceConstraintOpts | undefined;

  constructor(
    @Inject(NGT_PHYSIC_CONSTRAINT_WATCHED_CONTROLLER)
    private physicConstraintController: NgtPhysicConstraintController
  ) {}

  get api() {
    return this.physicConstraintController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicDistanceConstraint],
  exports: [NgtPhysicDistanceConstraint, NgtPhysicConstraintControllerModule],
})
export class NgtPhysicDistanceConstraintModule {}
