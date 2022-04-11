// GENERATED
import { Directive, NgModule } from '@angular/core';
import { PointToPointConstraintOpts } from '@pmndrs/cannon-worker-api';
import { NgtPhysicsConstraint, providePhysicsConstraint } from '../constraint';

@Directive({
    selector: 'ng-container[ngtPhysicPointToPointConstraint]',
    exportAs: 'ngtPhysicPointToPointConstraint',
    providers: [
        providePhysicsConstraint<'PointToPoint', PointToPointConstraintOpts>(
            NgtPhysicPointToPointConstraint
        ),
    ],
})
export class NgtPhysicPointToPointConstraint extends NgtPhysicsConstraint<
    'PointToPoint',
    PointToPointConstraintOpts
> {
    static ngAcceptInputType_options: PointToPointConstraintOpts | undefined;

    override get constraintType(): 'PointToPoint' {
        return 'PointToPoint';
    }
}

@NgModule({
    declarations: [NgtPhysicPointToPointConstraint],
    exports: [NgtPhysicPointToPointConstraint],
})
export class NgtPhysicPointToPointConstraintModule {}
