// GENERATED
import { DistanceConstraintOpts } from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';
import {
    NGT_CANNON_CONSTRAINT_CONTROLLER_PROVIDER,
    NGT_CANNON_CONSTRAINT_TYPE,
    NGT_CANNON_CONSTRAINT_WATCHED_CONTROLLER,
    NgtCannonConstraintController,
    NgtCannonConstraintControllerModule,
} from '../constraint.controller';

@Directive({
    selector: 'ng-container[ngtPhysicDistanceConstraint]',
    exportAs: 'ngtPhysicDistanceConstraint',
    providers: [
        NGT_CANNON_CONSTRAINT_CONTROLLER_PROVIDER,
        { provide: NGT_CANNON_CONSTRAINT_TYPE, useValue: 'Distance' },
    ],
})
export class NgtPhysicDistanceConstraint {
    static ngAcceptInputType_options: DistanceConstraintOpts | undefined;

    constructor(
        @Inject(NGT_CANNON_CONSTRAINT_WATCHED_CONTROLLER)
        private cannonConstraintController: NgtCannonConstraintController
    ) {}

    get api() {
        return this.cannonConstraintController.api;
    }
}

@NgModule({
    declarations: [NgtPhysicDistanceConstraint],
    exports: [NgtPhysicDistanceConstraint, NgtCannonConstraintControllerModule],
})
export class NgtPhysicDistanceConstraintModule {}
