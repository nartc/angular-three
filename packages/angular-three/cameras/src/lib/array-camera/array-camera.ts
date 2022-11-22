// GENERATED - AngularThree v1.0.0
import * as THREE from 'three';
import { Component } from '@angular/core';
import { injectArgs, NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify, NgtMatrix4, NgtEuler, NgtQuaternion, NgtLayers } from 'angular-three';

@Component({
    selector: 'ngt-array-camera',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtArrayCamera)],
    inputs: [...getInputs()]
})
export class NgtArrayCamera extends THREE.ArrayCamera {
    constructor() {
        super(...(injectArgs<typeof THREE.ArrayCamera>({ optional: true }) || []));
        return proxify(this);
    }
    
    static ngAcceptInputType_cameras: THREE.PerspectiveCamera[];
    static ngAcceptInputType_zoom: number;
    static ngAcceptInputType_fov: number;
    static ngAcceptInputType_aspect: number;
    static ngAcceptInputType_near: number;
    static ngAcceptInputType_far: number;
    static ngAcceptInputType_focus: number;
    static ngAcceptInputType_view: null | {enabled:boolean;fullWidth:number;fullHeight:number;offsetX:number;offsetY:number;width:number;height:number;};
    static ngAcceptInputType_filmGauge: number;
    static ngAcceptInputType_filmOffset: number;
    static ngAcceptInputType_matrixWorldInverse: NgtMatrix4;
    static ngAcceptInputType_projectionMatrix: NgtMatrix4;
    static ngAcceptInputType_projectionMatrixInverse: NgtMatrix4;
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
      'cameras',
      'zoom',
      'fov',
      'aspect',
      'near',
      'far',
      'focus',
      'view',
      'filmGauge',
      'filmOffset',
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