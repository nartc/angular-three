import { Component, Input } from '@angular/core';
import { injectInstance, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef } from 'angular-three';

@Component({
    selector: 'ngt-value',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtValueAttribute)],
})
export class NgtValueAttribute {
    private readonly instance = injectInstance({ host: true });

    @Input() set value(value: any) {
        this.instance.instanceRef.set(value);
    }
}
