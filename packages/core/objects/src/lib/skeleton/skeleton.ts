// GENERATED - AngularThree v1.0.0
import {
    injectArgs,
    NgtInstance,
    NgtMatrix4,
    NgtObservableInput,
    provideInstanceRef,
    proxify,
} from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-skeleton',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtSkeleton)],
    inputs: [...getInputs()],
})
export class NgtSkeleton extends THREE.Skeleton {
    constructor() {
        super(...injectArgs<typeof THREE.Skeleton>());
        return proxify(this, {
            attach: (parent, child) => {
                if (!(parent.value instanceof THREE.SkinnedMesh)) {
                    console.error('<ngt-skeleton> can only be used as a child of <ngt-skinned-mesh>');
                    return;
                }

                parent.value.bind(child.value);

                return () => {
                    child.value.dispose();
                };
            },
        });
    }

    static ngAcceptInputType_uuid: NgtObservableInput<string>;
    static ngAcceptInputType_bones: NgtObservableInput<THREE.Bone[]>;
    static ngAcceptInputType_boneInverses: NgtObservableInput<NgtMatrix4[]>;
    static ngAcceptInputType_boneMatrices: NgtObservableInput<Float32Array>;
    static ngAcceptInputType_boneTexture: NgtObservableInput<null | THREE.DataTexture>;
    static ngAcceptInputType_boneTextureSize: NgtObservableInput<number>;
    static ngAcceptInputType_frame: NgtObservableInput<number>;
}

function getInputs() {
    return ['uuid', 'bones', 'boneInverses', 'boneMatrices', 'boneTexture', 'boneTextureSize', 'frame'];
}