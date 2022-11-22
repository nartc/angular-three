// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify, NgtMatrix4, NgtVector3, NgtEuler, NgtQuaternion, NgtLayers } from 'angular-three';

@Component({
    selector: 'ngt-stereo-camera',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtStereoCamera)],
    inputs: [...getInputs()]
})
export class NgtStereoCamera extends THREE.StereoCamera {
    constructor() {
        super(...(injectArgs<typeof THREE.StereoCamera>({ optional: true }) || []));
        return proxify(this);
    }
    
    static ngAcceptInputType_aspect: number;
    static ngAcceptInputType_eyeSep: number;
    static ngAcceptInputType_cameraL: THREE.PerspectiveCamera;
    static ngAcceptInputType_cameraR: THREE.PerspectiveCamera;
    static ngAcceptInputType_matrixWorldInverse: NgtMatrix4;
    static ngAcceptInputType_projectionMatrix: NgtMatrix4;
    static ngAcceptInputType_projectionMatrixInverse: NgtMatrix4;
    static ngAcceptInputType_name: string;
    static ngAcceptInputType_position: NgtVector3;
    static ngAcceptInputType_rotation: NgtEuler;
    static ngAcceptInputType_quaternion: NgtQuaternion;
    static ngAcceptInputType_scale: NgtVector3;
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
    static ngAcceptInputType_DefaultUp: NgtVector3;
    static ngAcceptInputType_DefaultMatrixAutoUpdate: boolean;
    static ngAcceptInputType_DefaultMatrixWorldAutoUpdate: boolean;
}

function getInputs() {
  return [
      'aspect',
      'eyeSep',
      'cameraL',
      'cameraR',
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
