// GENERATED
import { Directive, NgModule } from '@angular/core';
import { ConeTwistConstraintOpts } from '@pmndrs/cannon-worker-api';
import { NgtPhysicsConstraint, providePhysicsConstraint } from '../constraint';

@Directive({
    selector: 'ng-container[ngtPhysicConeTwistConstraint]',
    exportAs: 'ngtPhysicConeTwistConstraint',
    providers: [
        providePhysicsConstraint<'ConeTwist', ConeTwistConstraintOpts>(
            NgtPhysicConeTwistConstraint
        ),
    ],
})
export class NgtPhysicConeTwistConstraint extends NgtPhysicsConstraint<
    'ConeTwist',
    ConeTwistConstraintOpts
> {
    static ngAcceptInputType_options: ConeTwistConstraintOpts | undefined;

    override get constraintType(): 'ConeTwist' {
        return 'ConeTwist';
    }
}

@NgModule({
    declarations: [NgtPhysicConeTwistConstraint],
    exports: [NgtPhysicConeTwistConstraint],
})
export class NgtPhysicConeTwistConstraintModule {}
