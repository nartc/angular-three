// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NgtInstance, provideInstanceRef, proxify } from '@angular-three/core';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-box3-helper',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtBox3Helper)],
})
export class NgtBox3Helper extends THREE.Box3Helper {
    constructor() {
        super(...injectArgs<typeof THREE.Box3Helper>());
        return proxify(this, {
            attach: (_, helper, stateFactory) => {
                const { scene, internal } = stateFactory();
                scene.add(helper.value);

                const unsubscribe = internal.subscribe(() => helper.value.updateMatrixWorld(), 0, stateFactory, helper);

                return () => {
                    scene.remove(helper.value);
                    unsubscribe();
                };
            },
        });
    }
}
