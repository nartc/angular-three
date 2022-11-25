import { injectInstance, NgtInstance, provideInstanceRef } from '@angular-three/core';
import { Component, Input } from '@angular/core';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-value',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtValueAttribute)],
})
export class NgtValueAttribute {
    private readonly instance = injectInstance({ host: true });

    @Input() set value(value: any) {
        this.instance.instanceRef.set(value);
    }
}
