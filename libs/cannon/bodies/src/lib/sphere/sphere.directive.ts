// GENERATED
import { SphereProps, GetByIndex } from '@angular-three/cannon';
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
    selector: '[ngtPhysicSphere]',
    exportAs: 'ngtPhysicSphere',
    providers: [
        NGT_CANNON_BODY_CONTROLLER_PROVIDER,
        { provide: NGT_CANNON_BODY_TYPE, useValue: 'Sphere' },
        {
            provide: NGT_CANNON_BODY_ARGS_FN,
            useValue: (args: SphereProps['args'] = [1]) => {
                if (!Array.isArray(args))
                    throw new Error('ngtPhysicSphere args must be an array');
                return [args[0]];
            },
        },
    ],
})
export class NgtPhysicSphere {
    static ngAcceptInputType_getPhysicProps:
        | GetByIndex<SphereProps>
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
    declarations: [NgtPhysicSphere],
    exports: [NgtPhysicSphere, NgtCannonBodyControllerModule],
})
export class NgtPhysicSphereModule {}
