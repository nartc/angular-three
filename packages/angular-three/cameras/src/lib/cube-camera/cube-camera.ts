// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify, NgtEuler, NgtQuaternion, NgtMatrix4, NgtLayers } from 'angular-three';

@Component({
    selector: 'ngt-cube-camera',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtCubeCamera)],
    inputs: [...getInputs()]
})
export class NgtCubeCamera extends THREE.CubeCamera {
    constructor() {
        super(...(injectArgs<typeof THREE.CubeCamera>() ));
        return proxify(this);
    }
    
    static ngAcceptInputType_renderTarget: THREE.WebGLCubeRenderTarget;
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
    static ngAcceptInputType_onBeforeRender: (renderer:THREE.WebGLRenderer, scene:THREE.Scene, camera:THREE.Camera, geometry:THREE.BufferGeometry, material:THREE.Material, group:THREE.Group) =&gt; void;
    static ngAcceptInputType_onAfterRender: (renderer:THREE.WebGLRenderer, scene:THREE.Scene, camera:THREE.Camera, geometry:THREE.BufferGeometry, material:THREE.Material, group:THREE.Group) =&gt; void;
    static ngAcceptInputType_DefaultUp: THREE.Vector3;
    static ngAcceptInputType_DefaultMatrixAutoUpdate: boolean;
    static ngAcceptInputType_DefaultMatrixWorldAutoUpdate: boolean;
}

function getInputs() {
  return [
      'renderTarget',
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
