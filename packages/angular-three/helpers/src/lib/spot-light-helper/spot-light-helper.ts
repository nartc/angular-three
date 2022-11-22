// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';

@Component({
    selector: 'ngt-spot-light-helper',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtSpotLightHelper)],
})
export class NgtSpotLightHelper extends THREE.SpotLightHelper {
    constructor() {
        super(...injectArgs<typeof THREE.SpotLightHelper>());
        return proxify(this, {
            attach: (_, helper, stateFactory) => {
                const { scene, internal } = stateFactory();
                scene.add(helper.value);

                const unsubscribe = internal.subscribe(() => helper.value.update(), 0, stateFactory, helper);

                return () => {
                    scene.remove(helper.value);
                    unsubscribe();
                };
            },
        });
    }
}
