// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify, NgtEuler, NgtQuaternion, NgtMatrix4, NgtLayers } from 'angular-three';

@Component({
    selector: 'ngt-positional-audio',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtPositionalAudio)],
    inputs: [...getInputs()]
})
export class NgtPositionalAudio extends THREE.PositionalAudio {
    constructor() {
        super(...injectArgs<typeof THREE.PositionalAudio>());
        return proxify(this);
    }
    
    static ngAcceptInputType_autoplay: boolean;
    static ngAcceptInputType_buffer: null | AudioBuffer;
    static ngAcceptInputType_detune: number;
    static ngAcceptInputType_loop: boolean;
    static ngAcceptInputType_loopStart: number;
    static ngAcceptInputType_loopEnd: number;
    static ngAcceptInputType_offset: number;
    static ngAcceptInputType_duration: number;
    static ngAcceptInputType_playbackRate: number;
    static ngAcceptInputType_isPlaying: boolean;
    static ngAcceptInputType_hasPlaybackControl: boolean;
    static ngAcceptInputType_sourceType: string;
    static ngAcceptInputType_source: null | AudioBufferSourceNode;
    static ngAcceptInputType_filters: AudioNode[];
    static ngAcceptInputType_name: string;
    static ngAcceptInputType_position: THREE.Vector3;
    static ngAcceptInputType_rotation: NgtEuler;
    static ngAcceptInputType_quaternion: NgtQuaternion;
    static ngAcceptInputType_scale: THREE.Vector3;
    static ngAcceptInputType_modelViewMatrix: NgtMatrix4;
    static ngAcceptInputType_normalMatrix: THREE.Matrix3;
    static ngAcceptInputType_matrix: NgtMatrix4;
    static ngAcceptInputType_matrixWorld: NgtMatrix4;
    static ngAcceptInputType_matrixAutoUpdate: boolean;
    static ngAcceptInputType_matrixWorldAutoUpdate: boolean;
    static ngAcceptInputType_matrixWorldNeedsUpdate: boolean;
    static ngAcceptInputType_layers: NgtLayers;
    static ngAcceptInputType_visible: boolean;
    static ngAcceptInputType_castShadow: boolean;
    static ngAcceptInputType_receiveShadow: boolean;
    static ngAcceptInputType_frustumCulled: boolean;
    static ngAcceptInputType_renderOrder: number;
    static ngAcceptInputType_animations: THREE.AnimationClip[];
    static ngAcceptInputType_userData: {[key: string]: any};
    static ngAcceptInputType_customDepthMaterial: THREE.Material;
    static ngAcceptInputType_customDistanceMaterial: THREE.Material;
    static ngAcceptInputType_onBeforeRender: (renderer:THREE.WebGLRenderer, scene:THREE.Scene, camera:THREE.Camera, geometry:THREE.BufferGeometry, material:THREE.Material, group:THREE.Group) => void;
    static ngAcceptInputType_onAfterRender: (renderer:THREE.WebGLRenderer, scene:THREE.Scene, camera:THREE.Camera, geometry:THREE.BufferGeometry, material:THREE.Material, group:THREE.Group) => void;
    static ngAcceptInputType_DefaultUp: THREE.Vector3;
    static ngAcceptInputType_DefaultMatrixAutoUpdate: boolean;
    static ngAcceptInputType_DefaultMatrixWorldAutoUpdate: boolean;
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
      'DefaultUp',
      'DefaultMatrixAutoUpdate',
      'DefaultMatrixWorldAutoUpdate',
  ];
}

