import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { Component } from '@angular/core';
import { TextGeometry } from 'three-stdlib';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-text-geometry',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(SobaTextGeometry)],
})
export class SobaTextGeometry extends TextGeometry {
    constructor() {
        super(...injectArgs<typeof TextGeometry>());
        return proxify(this, { attach: 'geometry' });
    }
}
