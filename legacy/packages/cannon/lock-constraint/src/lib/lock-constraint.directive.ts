//GENERATED
import {
  NgtPhysicConstraint,
  LockConstraintOpts,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: 'ng-container[ngtLockConstraint]',
  exportAs: 'ngtLockConstraint',
  providers: [{ provide: NgtPhysicConstraint, useExisting: NgtLockConstraint }],
})
export class NgtLockConstraint extends NgtPhysicConstraint<'Lock'> {
  static ngAcceptInputType_options: LockConstraintOpts | undefined;

  protected get type(): 'Lock' {
    return 'Lock';
  }
}
