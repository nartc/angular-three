import {
    createBeforeRenderCallback,
    EventEmitterOf,
    NgtCompound,
    NgtInstance,
    NgtObjectCompound,
    NgtObservableInput,
    provideInstanceRef,
} from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { NgTemplateOutlet } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';

@Component({
    selector: 'ngt-soba-billboard',
    standalone: true,
    template: `
        <ngt-group [objectCompound]="this" [beforeRender]="onBeforeRender">
            <ng-content></ng-content>
        </ngt-group>
    `,
    imports: [NgtGroup, NgTemplateOutlet, NgtObjectCompound],
    providers: [provideInstanceRef(SobaBillboard, { compound: true })],
    inputs: [...NGT_INSTANCE_INPUTS, ...NGT_OBJECT3D_INPUTS],
    outputs: NGT_INSTANCE_OUTPUTS,
})
export class SobaBillboard extends NgtCompound<NgtGroup> {
    @Input() set follow(follow: NgtObservableInput<boolean>) {
        this.write({ follow });
    }

    @Input() set lockX(lockX: NgtObservableInput<boolean>) {
        this.write({ lockX });
    }

    @Input() set lockY(lockY: NgtObservableInput<boolean>) {
        this.write({ lockY });
    }

    @Input() set lockZ(lockZ: NgtObservableInput<boolean>) {
        this.write({ lockZ });
    }

    override initialize() {
        super.initialize();
        this.write({ follow: true, lockX: false, lockY: false, lockZ: false });
    }

    override get useOnHost(): (keyof NgtGroup | string)[] {
        return [...super.useOnHost, 'beforeRender'];
    }

    override get compoundInputs(): (keyof NgtGroup | string)[] {
        return [...super.compoundInputs, ...NGT_OBJECT3D_INPUTS];
    }

    override get compoundOutputs(): EventEmitterOf<NgtInstance>[] {
        return [...super.compoundOutputs, ...NGT_INSTANCE_OUTPUTS] as EventEmitterOf<NgtInstance>[];
    }

    readonly onBeforeRender = createBeforeRenderCallback<THREE.Group>(({ state, object: billboard }) => {
        const { follow, lockX, lockY, lockZ } = this.read();

        if (!follow) return;

        // save previous rotation in case we're locking an axis
        const prevRotation = billboard.rotation.clone();

        // always face the camera
        billboard.quaternion.copy(state.camera.quaternion);

        // readjust any axis that is locked
        if (lockX) billboard.rotation.x = prevRotation.x;
        if (lockY) billboard.rotation.y = prevRotation.y;
        if (lockZ) billboard.rotation.z = prevRotation.z;

        if (this.read((s) => s['beforeRender'])) {
            this.read((s) => s['beforeRender'])(state, billboard);
        }
    });
}
