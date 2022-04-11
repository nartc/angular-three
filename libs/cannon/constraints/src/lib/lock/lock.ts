// GENERATED
import { Directive, NgModule } from '@angular/core';
import { LockConstraintOpts } from '@pmndrs/cannon-worker-api';
import { NgtPhysicsConstraint, providePhysicsConstraint } from '../constraint';

@Directive({
    selector: 'ng-container[ngtPhysicLockConstraint]',
    exportAs: 'ngtPhysicLockConstraint',
    providers: [
        providePhysicsConstraint<'Lock', LockConstraintOpts>(
            NgtPhysicLockConstraint
        ),
    ],
})
export class NgtPhysicLockConstraint extends NgtPhysicsConstraint<
    'Lock',
    LockConstraintOpts
> {
    static ngAcceptInputType_options: LockConstraintOpts | undefined;

    override get constraintType(): 'Lock' {
        return 'Lock';
    }
}

@NgModule({
    declarations: [NgtPhysicLockConstraint],
    exports: [NgtPhysicLockConstraint],
})
export class NgtPhysicLockConstraintModule {}
