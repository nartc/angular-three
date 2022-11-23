// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import {
    injectArgs,
    NgtEuler,
    NgtInstance,
    NgtLayers,
    NgtMatrix4,
    NgtObservableInput,
    NgtQuaternion,
    NgtVector3,
    provideInstanceRef,
    proxify,
} from '@angular-three/core';
import { NGT_INSTANCE_INPUTS, NGT_INSTANCE_OUTPUTS, NGT_OBJECT3D_INPUTS } from '../common';

@Component({
    selector: 'ngt-audio',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS, outputs: NGT_INSTANCE_OUTPUTS }],
    providers: [provideInstanceRef(NgtAudio)],
    inputs: [...getInputs(), ...NGT_OBJECT3D_INPUTS],
})
export class NgtAudio extends THREE.Audio {
    constructor() {
        super(...injectArgs<typeof THREE.Audio>());
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
    ];
}
