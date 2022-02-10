// GENERATED
import { BoxProps, GetByIndex } from '@angular-three/cannon';
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
    selector: '[ngtPhysicBox]',
    exportAs: 'ngtPhysicBox',
    providers: [
        NGT_CANNON_BODY_CONTROLLER_PROVIDER,
        { provide: NGT_CANNON_BODY_TYPE, useValue: 'Box' },
        {
            provide: NGT_CANNON_BODY_ARGS_FN,
            useValue: (args: BoxProps['args'] = [1, 1, 1]) => args,
        },
    ],
})
export class NgtPhysicBox {
    static ngAcceptInputType_getPhysicProps: GetByIndex<BoxProps> | undefined;

    constructor(
        @Inject(NGT_CANNON_BODY_WATCHED_CONTROLLER)
        private cannonBodyController: NgtCannonBodyController
    ) {}

    get api() {
        return this.cannonBodyController.api;
    }
}

@NgModule({
    declarations: [NgtPhysicBox],
    exports: [NgtPhysicBox, NgtCannonBodyControllerModule],
})
export class NgtPhysicBoxModule {}
