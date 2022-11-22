import { Component, Input } from '@angular/core';
import {
    injectInstance,
    NGT_INSTANCE_INPUTS,
    NGT_INSTANCE_OUTPUTS,
    NgtInstance,
    provideInstanceRef,
} from 'angular-three';

@Component({
    selector: 'ngt-value',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(NgtValueAttribute)],
})
export class NgtValueAttribute {
    private readonly instance = injectInstance({ host: true });

    @Input() set value(value: any) {
        this.instance.instanceRef.set(value);
    }
}
