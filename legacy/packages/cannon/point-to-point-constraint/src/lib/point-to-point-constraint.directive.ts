//GENERATED
import {
  NgtPhysicConstraint,
  PointToPointConstraintOpts,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-container[ngtPointToPointConstraint]',
  exportAs: 'ngtPointToPointConstraint',
  providers: [{ provide: NgtPhysicConstraint, useExisting: NgtPointToPointConstraint }],
})
export class NgtPointToPointConstraint extends NgtPhysicConstraint<'PointToPoint'> {
  static ngAcceptInputType_options: PointToPointConstraintOpts | undefined;

  protected get type(): 'PointToPoint' {
    return 'PointToPoint';
  }
}
