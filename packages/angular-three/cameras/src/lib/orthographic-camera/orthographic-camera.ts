// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import {
    injectArgs,
    NGT_INSTANCE_HOST_DIRECTIVE,
    provideInstanceRef,
    proxify,
    NgtMatrix4,
    NgtVector3,
    NgtEuler,
    NgtQuaternion,
    NgtLayers,
    NgtObservableInput,
} from 'angular-three';

@Component({
    selector: 'ngt-orthographic-camera',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtOrthographicCamera)],
    inputs: [...getInputs()],
})
export class NgtOrthographicCamera extends THREE.OrthographicCamera {
    constructor() {
        super(...(injectArgs<typeof THREE.OrthographicCamera>({ optional: true }) || []));
        return proxify(this);
    }

    static ngAcceptInputType_zoom: NgtObservableInput<number>;
    static ngAcceptInputType_view: NgtObservableInput<null | {
        enabled: boolean;
        fullWidth: number;
        fullHeight: number;
        offsetX: number;
        offsetY: number;
        width: number;
        height: number;
    }>;
    static ngAcceptInputType_left: NgtObservableInput<number>;
    static ngAcceptInputType_right: NgtObservableInput<number>;
    static ngAcceptInputType_top: NgtObservableInput<number>;
    static ngAcceptInputType_bottom: NgtObservableInput<number>;
    static ngAcceptInputType_near: NgtObservableInput<number>;
    static ngAcceptInputType_far: NgtObservableInput<number>;
    static ngAcceptInputType_matrixWorldInverse: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_projectionMatrix: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_projectionMatrixInverse: NgtObservableInput<NgtMatrix4>;
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
    static ngAcceptInputType_DefaultUp: NgtObservableInput<NgtVector3>;
    static ngAcceptInputType_DefaultMatrixAutoUpdate: NgtObservableInput<boolean>;
    static ngAcceptInputType_DefaultMatrixWorldAutoUpdate: NgtObservableInput<boolean>;
}

function getInputs() {
    return [
        'zoom',
        'view',
        'left',
        'right',
        'top',
        'bottom',
        'near',
        'far',
        'matrixWorldInverse',
        'projectionMatrix',
        'projectionMatrixInverse',
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
        'DefaultUp',
        'DefaultMatrixAutoUpdate',
        'DefaultMatrixWorldAutoUpdate',
    ];
}
