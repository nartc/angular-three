// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-plane-helper',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtPlaneHelper)],
})
export class NgtPlaneHelper extends THREE.PlaneHelper {
    constructor() {
        super(...injectArgs<typeof THREE.PlaneHelper>());
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