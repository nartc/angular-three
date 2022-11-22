// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import {
    injectArgs,
    NGT_INSTANCE_HOST_DIRECTIVE,
    provideInstanceRef,
    proxify,
    NgtVector3,
    NgtEuler,
    NgtQuaternion,
    NgtMatrix4,
    NgtLayers,
    NgtObservableInput,
} from 'angular-three';

@Component({
    selector: 'ngt-ambient-light-probe',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtAmbientLightProbe)],
    inputs: [...getInputs()],
})
export class NgtAmbientLightProbe extends THREE.AmbientLightProbe {
    constructor() {
        super(...(injectArgs<typeof THREE.AmbientLightProbe>({ optional: true }) || []));
        return proxify(this);
    }

    static ngAcceptInputType_color: NgtObservableInput<THREE.ColorRepresentation> | undefined;
    static ngAcceptInputType_intensity: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_sh: NgtObservableInput<THREE.SphericalHarmonics3>;
    static ngAcceptInputType_hex: NgtObservableInput<number | string> | undefined;
    static ngAcceptInputType_shadow: NgtObservableInput<THREE.LightShadow>;
    static ngAcceptInputType_shadowCameraFov: NgtObservableInput<any>;
    static ngAcceptInputType_shadowCameraLeft: NgtObservableInput<any>;
    static ngAcceptInputType_shadowCameraRight: NgtObservableInput<any>;
    static ngAcceptInputType_shadowCameraTop: NgtObservableInput<any>;
    static ngAcceptInputType_shadowCameraBottom: NgtObservableInput<any>;
    static ngAcceptInputType_shadowCameraNear: NgtObservableInput<any>;
    static ngAcceptInputType_shadowCameraFar: NgtObservableInput<any>;
    static ngAcceptInputType_shadowBias: NgtObservableInput<any>;
    static ngAcceptInputType_shadowMapWidth: NgtObservableInput<any>;
    static ngAcceptInputType_shadowMapHeight: NgtObservableInput<any>;
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
        'color',
        'intensity',
        'sh',
        'hex',
        'shadow',
        'shadowCameraFov',
        'shadowCameraLeft',
        'shadowCameraRight',
        'shadowCameraTop',
        'shadowCameraBottom',
        'shadowCameraNear',
        'shadowCameraFar',
        'shadowBias',
        'shadowMapWidth',
        'shadowMapHeight',
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
