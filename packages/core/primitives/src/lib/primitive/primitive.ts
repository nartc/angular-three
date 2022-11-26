import {
    injectArgs,
    NgtAnyRecord,
    NgtComponentStore,
    NgtInstance,
    NgtObservableInput,
    provideInstanceRef,
    proxify,
} from '@angular-three/core';
import { Component } from '@angular/core';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-primitive',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtPrimitive)],
    inputs: ['props'],
})
export class NgtPrimitive extends NgtComponentStore {
    constructor() {
        super();
        const [object] = injectArgs();
        return proxify(object, { primitive: true });
    }

    static ngAcceptInputType_props: NgtObservableInput<NgtAnyRecord>;
}
