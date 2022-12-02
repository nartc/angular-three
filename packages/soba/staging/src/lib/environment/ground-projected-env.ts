import { injectArgs, NgtInstance, NgtObservableInput, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import { GroundProjectedEnv } from 'three-stdlib';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-ground-projected-env',
    standalone: true,
    template: '<ng-content></ng-content>',
    providers: [provideInstanceRef(SobaGroundProjectedEnv)],
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    inputs: [...NGT_OBJECT3D_INPUTS, ...getInputs()],
})
export class SobaGroundProjectedEnv extends GroundProjectedEnv {
    constructor() {
        super(...injectArgs<typeof GroundProjectedEnv>()());
        return proxify(this);
    }

    static ngAcceptInputType_height: NgtObservableInput<number>;
    static ngAcceptInputType_radius: NgtObservableInput<number>;
}

function getInputs() {
    return ['height', 'radius'];
}
