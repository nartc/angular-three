//GENERATED
import {
  NgtPhysicConstraint,
  ConeTwistConstraintOpts,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-container[ngtConeTwistConstraint]',
  exportAs: 'ngtConeTwistConstraint',
  providers: [{ provide: NgtPhysicConstraint, useExisting: NgtConeTwistConstraint }],
})
export class NgtConeTwistConstraint extends NgtPhysicConstraint<'ConeTwist'> {
  static ngAcceptInputType_options: ConeTwistConstraintOpts | undefined;

  protected get type(): 'ConeTwist' {
    return 'ConeTwist';
  }
}
