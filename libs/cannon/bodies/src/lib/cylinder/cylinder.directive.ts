// GENERATED
import { CylinderProps, GetByIndex } from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';
import {
    NGT_CANNON_BODY_ARGS_FN,
    NGT_CANNON_BODY_CONTROLLER_PROVIDER,
    NGT_CANNON_BODY_TYPE,
    NGT_CANNON_BODY_WATCHED_CONTROLLER,
    NgtCannonBodyController,
    NgtCannonBodyControllerModule,
} from '../body.controller';

@Directive({
    selector: '[ngtPhysicCylinder]',
    exportAs: 'ngtPhysicCylinder',
    providers: [
        NGT_CANNON_BODY_CONTROLLER_PROVIDER,
        { provide: NGT_CANNON_BODY_TYPE, useValue: 'Cylinder' },
        {
            provide: NGT_CANNON_BODY_ARGS_FN,
            useValue: (args: CylinderProps['args'] = []) => args,
        },
    ],
})
export class NgtPhysicCylinder {
    static ngAcceptInputType_getPhysicProps:
        | GetByIndex<CylinderProps>
        | undefined;

    constructor(
        @Inject(NGT_CANNON_BODY_WATCHED_CONTROLLER)
        private cannonBodyController: NgtCannonBodyController
    ) {}

    get api() {
        return this.cannonBodyController.api;
    }
}

@NgModule({
    declarations: [NgtPhysicCylinder],
    exports: [NgtPhysicCylinder, NgtCannonBodyControllerModule],
})
export class NgtPhysicCylinderModule {}
