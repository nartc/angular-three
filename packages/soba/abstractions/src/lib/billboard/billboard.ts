import {
    createBeforeRenderCallback,
    injectInstance,
    NgtInstance,
    NgtObservableInput,
    NgtWrapper,
    provideInstanceRef,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { Component, Input } from '@angular/core';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS } from '../common';

@Component({
    selector: 'ngt-soba-billboard',
    standalone: true,
    template: `
        <ngt-group *wrapper="this">
            <ng-content></ng-content>
        </ngt-group>
    `,
    imports: [NgtGroup, NgtWrapper],
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(SobaBillboard)],
})
export class SobaBillboard extends NgtGroup {
    private readonly instance = injectInstance<THREE.Group>({ self: true });

    @Input() set follow(follow: NgtObservableInput<boolean>) {
        this.instance.write({ follow });
    }

    @Input() set lockX(lockX: NgtObservableInput<boolean>) {
        this.instance.write({ lockX });
    }

    @Input() set lockY(lockY: NgtObservableInput<boolean>) {
        this.instance.write({ lockY });
    }

    @Input() set lockZ(lockZ: NgtObservableInput<boolean>) {
        this.instance.write({ lockZ });
    }

    constructor() {
        super();
        this.instance.write({ follow: true, lockX: false, lockY: false, lockZ: false });
        this.instance.beforeRender = createBeforeRenderCallback<THREE.Group>(({ state, object: billboard }) => {
            const { follow, lockX, lockY, lockZ } = this.instance.read();

            if (!follow) return;

            // save previous rotation in case we're locking an axis
            const prevRotation = billboard.rotation.clone();

            // always face the camera
            billboard.quaternion.copy(state.camera.quaternion);

            // readjust any axis that is locked
            if (lockX) billboard.rotation.x = prevRotation.x;
            if (lockY) billboard.rotation.y = prevRotation.y;
            if (lockZ) billboard.rotation.z = prevRotation.z;
        });
    }
}
