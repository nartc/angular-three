import { Component, Input } from '@angular/core';
import {
    injectArgs,
    NgtAnyRecord,
    NgtComponentStore,
    NgtInstance,
    NgtObservableInput,
    provideInstanceRef,
    proxify,
} from 'angular-three';
import { Subscription, tap } from 'rxjs';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-primitive',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtPrimitive)],
})
export class NgtPrimitive extends NgtComponentStore {
    private propsSubscription?: Subscription;
    @Input() set props(props: NgtObservableInput<NgtAnyRecord>) {
        if (this.propsSubscription) {
            this.propsSubscription.unsubscribe();
        }

        this.propsSubscription = this.effect<NgtAnyRecord>(
            tap((properties) => {
                for (const [key, value] of Object.entries(properties)) {
                    this[key as keyof typeof this] = value;
                }
            })
        )(props);
    }

    constructor() {
        super();
        const [object] = injectArgs();
        return proxify(object, { primitive: true });
    }
}
