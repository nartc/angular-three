// GENERATED
import { ConeTwistConstraintOpts } from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';
import {
    NGT_CANNON_CONSTRAINT_CONTROLLER_PROVIDER,
    NGT_CANNON_CONSTRAINT_TYPE,
    NGT_CANNON_CONSTRAINT_WATCHED_CONTROLLER,
    NgtCannonConstraintController,
    NgtCannonConstraintControllerModule,
} from '../constraint.controller';

@Directive({
    selector: 'ng-container[ngtPhysicConeTwistConstraint]',
    exportAs: 'ngtPhysicConeTwistConstraint',
    providers: [
        NGT_CANNON_CONSTRAINT_CONTROLLER_PROVIDER,
        { provide: NGT_CANNON_CONSTRAINT_TYPE, useValue: 'ConeTwist' },
    ],
})
export class NgtPhysicConeTwistConstraint {
    static ngAcceptInputType_options: ConeTwistConstraintOpts | undefined;

    constructor(
        @Inject(NGT_CANNON_CONSTRAINT_WATCHED_CONTROLLER)
        private cannonConstraintController: NgtCannonConstraintController
    ) {}

    get api() {
        return this.cannonConstraintController.api;
    }
}

@NgModule({
    declarations: [NgtPhysicConeTwistConstraint],
    exports: [
        NgtPhysicConeTwistConstraint,
        NgtCannonConstraintControllerModule,
    ],
})
export class NgtPhysicConeTwistConstraintModule {}
