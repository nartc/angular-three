//GENERATED
import {
  NgtPhysicConstraint,
  DistanceConstraintOpts,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-container[ngtDistanceConstraint]',
  exportAs: 'ngtDistanceConstraint',
  providers: [
    { provide: NgtPhysicConstraint, useExisting: NgtDistanceConstraint },
  ],
})
export class NgtDistanceConstraint extends NgtPhysicConstraint<'Distance'> {
  static ngAcceptInputType_options: DistanceConstraintOpts | undefined;

  protected get type(): 'Distance' {
    return 'Distance';
  }
}
