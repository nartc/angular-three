// GENERATED
import { Directive, NgModule } from '@angular/core';
import { HingeConstraintOpts } from '@pmndrs/cannon-worker-api';
import { NgtPhysicsConstraint, providePhysicsConstraint } from '../constraint';

@Directive({
    selector: 'ng-container[ngtPhysicHingeConstraint]',
    exportAs: 'ngtPhysicHingeConstraint',
    providers: [
        providePhysicsConstraint<'Hinge', HingeConstraintOpts>(
            NgtPhysicHingeConstraint
        ),
    ],
})
export class NgtPhysicHingeConstraint extends NgtPhysicsConstraint<
    'Hinge',
    HingeConstraintOpts
> {
    static ngAcceptInputType_options: HingeConstraintOpts | undefined;

    override get constraintType(): 'Hinge' {
        return 'Hinge';
    }
}

@NgModule({
    declarations: [NgtPhysicHingeConstraint],
    exports: [NgtPhysicHingeConstraint],
})
export class NgtPhysicHingeConstraintModule {}
