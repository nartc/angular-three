//GENERATED
import {
  NgtPhysicConstraint,
  HingeConstraintOpts,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-container[ngtHingeConstraint]',
  exportAs: 'ngtHingeConstraint',
  providers: [
    { provide: NgtPhysicConstraint, useExisting: NgtHingeConstraint },
  ],
})
export class NgtHingeConstraint extends NgtPhysicConstraint<'Hinge'> {
  static ngAcceptInputType_options: HingeConstraintOpts | undefined;

  protected get type(): 'Hinge' {
    return 'Hinge';
  }
}
