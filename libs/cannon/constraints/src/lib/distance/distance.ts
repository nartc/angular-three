// GENERATED
import { Directive, NgModule } from '@angular/core';
import { DistanceConstraintOpts } from '@pmndrs/cannon-worker-api';
import { NgtPhysicsConstraint, providePhysicsConstraint } from '../constraint';

@Directive({
    selector: 'ng-container[ngtPhysicDistanceConstraint]',
    exportAs: 'ngtPhysicDistanceConstraint',
    providers: [
        providePhysicsConstraint<'Distance', DistanceConstraintOpts>(
            NgtPhysicDistanceConstraint
        ),
    ],
})
export class NgtPhysicDistanceConstraint extends NgtPhysicsConstraint<
    'Distance',
    DistanceConstraintOpts
> {
    static ngAcceptInputType_options: DistanceConstraintOpts | undefined;

    override get constraintType(): 'Distance' {
        return 'Distance';
    }
}

@NgModule({
    declarations: [NgtPhysicDistanceConstraint],
    exports: [NgtPhysicDistanceConstraint],
})
export class NgtPhysicDistanceConstraintModule {}
