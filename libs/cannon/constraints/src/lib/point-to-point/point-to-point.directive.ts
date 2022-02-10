// GENERATED
import { PointToPointConstraintOpts } from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';
import {
    NGT_CANNON_CONSTRAINT_CONTROLLER_PROVIDER,
    NGT_CANNON_CONSTRAINT_TYPE,
    NGT_CANNON_CONSTRAINT_WATCHED_CONTROLLER,
    NgtCannonConstraintController,
    NgtCannonConstraintControllerModule,
} from '../constraint.controller';

@Directive({
    selector: 'ng-container[ngtPhysicPointToPointConstraint]',
    exportAs: 'ngtPhysicPointToPointConstraint',
    providers: [
        NGT_CANNON_CONSTRAINT_CONTROLLER_PROVIDER,
        { provide: NGT_CANNON_CONSTRAINT_TYPE, useValue: 'PointToPoint' },
    ],
})
export class NgtPhysicPointToPointConstraint {
    static ngAcceptInputType_options: PointToPointConstraintOpts | undefined;

    constructor(
        @Inject(NGT_CANNON_CONSTRAINT_WATCHED_CONTROLLER)
        private cannonConstraintController: NgtCannonConstraintController
    ) {}

    get api() {
        return this.cannonConstraintController.api;
    }
}

@NgModule({
    declarations: [NgtPhysicPointToPointConstraint],
    exports: [
        NgtPhysicPointToPointConstraint,
        NgtCannonConstraintControllerModule,
    ],
})
export class NgtPhysicPointToPointConstraintModule {}
