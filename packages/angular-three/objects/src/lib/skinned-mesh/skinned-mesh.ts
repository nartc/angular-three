// GENERATED - AngularThree v1.0.0
import {
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
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-skinned-mesh',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtSkinnedMesh)],
    inputs: [...getInputs()],
})
export class NgtSkinnedMesh extends THREE.SkinnedMesh {
    constructor() {
        super();
        return proxify(this);
    }

    static ngAcceptInputType_bindMode: NgtObservableInput<string>;
    static ngAcceptInputType_bindMatrix: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_bindMatrixInverse: NgtObservableInput<NgtMatrix4>;
    static ngAcceptInputType_skeleton: NgtObservableInput<THREE.Skeleton>;
    static ngAcceptInputType_geometry: NgtObservableInput<THREE.BufferGeometry>;
    static ngAcceptInputType_material: NgtObservableInput<THREE.Material | THREE.Material[]>;
    static ngAcceptInputType_morphTargetInfluences: NgtObservableInput<number[]> | undefined;
    static ngAcceptInputType_morphTargetDictionary: NgtObservableInput<{ [key: string]: number }> | undefined;
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
        'bindMode',
        'bindMatrix',
        'bindMatrixInverse',
        'skeleton',
        'geometry',
        'material',
        'morphTargetInfluences',
        'morphTargetDictionary',
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
