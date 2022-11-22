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
    selector: 'ngt-positional-audio',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtPositionalAudio)],
    inputs: [...getInputs()],
})
export class NgtPositionalAudio extends THREE.PositionalAudio {
    constructor() {
        super(...injectArgs<typeof THREE.PositionalAudio>());
        return proxify(this);
    }

    static ngAcceptInputType_autoplay: NgtObservableInput<boolean>;
    static ngAcceptInputType_buffer: NgtObservableInput<null | AudioBuffer>;
    static ngAcceptInputType_detune: NgtObservableInput<number>;
    static ngAcceptInputType_loop: NgtObservableInput<boolean>;
    static ngAcceptInputType_loopStart: NgtObservableInput<number>;
    static ngAcceptInputType_loopEnd: NgtObservableInput<number>;
    static ngAcceptInputType_offset: NgtObservableInput<number>;
    static ngAcceptInputType_duration: NgtObservableInput<number>;
    static ngAcceptInputType_playbackRate: NgtObservableInput<number>;
    static ngAcceptInputType_isPlaying: NgtObservableInput<boolean>;
    static ngAcceptInputType_hasPlaybackControl: NgtObservableInput<boolean>;
    static ngAcceptInputType_sourceType: NgtObservableInput<string>;
    static ngAcceptInputType_source: NgtObservableInput<null | AudioBufferSourceNode>;
    static ngAcceptInputType_filters: NgtObservableInput<AudioNode[]>;
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
        'autoplay',
        'buffer',
        'detune',
        'loop',
        'loopStart',
        'loopEnd',
        'offset',
        'duration',
        'playbackRate',
        'isPlaying',
        'hasPlaybackControl',
        'sourceType',
        'source',
        'filters',
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
