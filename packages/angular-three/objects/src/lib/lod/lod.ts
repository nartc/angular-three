// GENERATED - AngularThree v1.0.0
import {
    NgtInstance,
    provideInstanceRef,
    proxify,
    NgtVector3,
    NgtEuler,
    NgtQuaternion,
    NgtMatrix4,
    NgtLayers,
    NgtObservableInput,
} from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';

@Component({
    selector: 'ngt-lod',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(NgtLOD)],
    inputs: [...getInputs(), ...NGT_OBJECT3D_INPUTS],
})
export class NgtLOD extends THREE.LOD {
    constructor() {
        super();
        return proxify(this);
    }

    static ngAcceptInputType_levels: NgtObservableInput<{ distance: number; object: THREE.Object3D }[]>;
    static ngAcceptInputType_autoUpdate: NgtObservableInput<boolean>;
    static ngAcceptInputType_name: NgtObservableInput<string>;
    static ngAcceptInputType_position: NgtObservableInput<NgtVector3>;
    static ngAcceptInputType_rotation: NgtObservableInput<NgtEuler>;
    static ngAcceptInputType_quaternion: NgtObservableInput<NgtQuaternion>;
    static ngAcceptInputType_scale: NgtObservableInput<NgtVector3>;
    static ngAcceptInputType_modelViewMatrix: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_normalMatrix: NgtObservableInput<THREE.Matrix3>;
    static ngAcceptInputType_matrix: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_matrixWorld: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_matrixAutoUpdate: NgtObservableInput<boolean>;
    static ngAcceptInputType_matrixWorldAutoUpdate: NgtObservableInput<boolean>;
    static ngAcceptInputType_matrixWorldNeedsUpdate: NgtObservableInput<boolean>;
    static ngAcceptInputType_layers: NgtObservableInput<NgtLayers>;
    static ngAcceptInputType_visible: NgtObservableInput<boolean>;
    static ngAcceptInputType_castShadow: NgtObservableInput<boolean>;
    static ngAcceptInputType_receiveShadow: NgtObservableInput<boolean>;
    static ngAcceptInputType_frustumCulled: NgtObservableInput<boolean>;
    static ngAcceptInputType_renderOrder: NgtObservableInput<number>;
    static ngAcceptInputType_animations: NgtObservableInput<THREE.AnimationClip[]>;
    static ngAcceptInputType_userData: NgtObservableInput<{ [key: string]: any }>;
    static ngAcceptInputType_customDepthMaterial: NgtObservableInput<THREE.Material>;
    static ngAcceptInputType_customDistanceMaterial: NgtObservableInput<THREE.Material>;
    static ngAcceptInputType_onBeforeRender: NgtObservableInput<
        (
            renderer: THREE.WebGLRenderer,
            scene: THREE.Scene,
            camera: THREE.Camera,
            geometry: THREE.BufferGeometry,
            material: THREE.Material,
            group: THREE.Group
        ) => void
    >;
    static ngAcceptInputType_onAfterRender: NgtObservableInput<
        (
            renderer: THREE.WebGLRenderer,
            scene: THREE.Scene,
            camera: THREE.Camera,
            geometry: THREE.BufferGeometry,
            material: THREE.Material,
            group: THREE.Group
        ) => void
    >;
}

function getInputs() {
    return ['levels', 'autoUpdate'];
}
