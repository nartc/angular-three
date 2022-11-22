import * as THREE from 'three';
import { Component } from '@angular/core';
import {
    injectArgs,
    NGT_INSTANCE_INPUTS,
    NGT_INSTANCE_OUTPUTS,
    NgtEuler,
    NgtInstance,
    NgtLayers,
    NgtMatrix4,
    NgtObservableInput,
    NgtQuaternion,
    NgtVector3,
    provideInstanceRef,
    proxify,
} from 'angular-three';

@Component({
    selector: 'ngt-object-primitive',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(NgtObjectPrimitive)],
    inputs: [...getInputs()],
})
export class NgtObjectPrimitive extends THREE.Object3D {
    constructor() {
        super();
        const [object] = injectArgs();
        return proxify<THREE.Object3D>(object, { primitive: true });
    }

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
    return [
        'name',
        'position',
        'rotation',
        'quaternion',
        'scale',
        'modelViewMatrix',
        'normalMatrix',
        'matrix',
        'matrixWorld',
        'matrixAutoUpdate',
        'matrixWorldAutoUpdate',
        'matrixWorldNeedsUpdate',
        'layers',
        'visible',
        'castShadow',
        'receiveShadow',
        'frustumCulled',
        'renderOrder',
        'animations',
        'userData',
        'customDepthMaterial',
        'customDistanceMaterial',
        'onBeforeRender',
        'onAfterRender',
    ];
}
