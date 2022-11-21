// GENERATED - AngularThree v1.0.0
import { NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-lambert-material',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtMeshLambertMaterial)],
    inputs: [...getInputs()],
})
export class NgtMeshLambertMaterial extends THREE.MeshLambertMaterial {
    constructor() {
        super();
        return proxify(this, { attach: 'material' });
    }
    
    static ngAcceptInputType_bumpMap: THREE.Texture| undefined;
    static ngAcceptInputType_bumpScale: number| undefined;
    static ngAcceptInputType_color: THREE.ColorRepresentation| undefined;
    static ngAcceptInputType_displacementMap: THREE.Texture| undefined;
    static ngAcceptInputType_displacementScale: number| undefined;
    static ngAcceptInputType_displacementBias: number| undefined;
    static ngAcceptInputType_emissive: THREE.ColorRepresentation| undefined;
    static ngAcceptInputType_emissiveIntensity: number| undefined;
    static ngAcceptInputType_emissiveMap: THREE.Texture | null| undefined;
    static ngAcceptInputType_flatShading: boolean| undefined;
    static ngAcceptInputType_map: THREE.Texture | null| undefined;
    static ngAcceptInputType_lightMap: THREE.Texture | null| undefined;
    static ngAcceptInputType_lightMapIntensity: number| undefined;
    static ngAcceptInputType_normalMap: THREE.Texture| undefined;
    static ngAcceptInputType_normalScale: THREE.Vector2| undefined;
    static ngAcceptInputType_aoMap: THREE.Texture | null| undefined;
    static ngAcceptInputType_aoMapIntensity: number| undefined;
    static ngAcceptInputType_specularMap: THREE.Texture | null| undefined;
    static ngAcceptInputType_alphaMap: THREE.Texture | null| undefined;
    static ngAcceptInputType_envMap: THREE.Texture | null| undefined;
    static ngAcceptInputType_combine: THREE.Combine| undefined;
    static ngAcceptInputType_reflectivity: number| undefined;
    static ngAcceptInputType_refractionRatio: number| undefined;
    static ngAcceptInputType_wireframe: boolean| undefined;
    static ngAcceptInputType_wireframeLinewidth: number| undefined;
    static ngAcceptInputType_wireframeLinecap: string| undefined;
    static ngAcceptInputType_wireframeLinejoin: string| undefined;
    static ngAcceptInputType_fog: boolean| undefined;
    static ngAcceptInputType_alphaTest: number| undefined;
    static ngAcceptInputType_alphaToCoverage: boolean| undefined;
    static ngAcceptInputType_blendDst: THREE.BlendingDstFactor| undefined;
    static ngAcceptInputType_blendDstAlpha: number| undefined;
    static ngAcceptInputType_blendEquation: THREE.BlendingEquation| undefined;
    static ngAcceptInputType_blendEquationAlpha: number| undefined;
    static ngAcceptInputType_blending: THREE.Blending| undefined;
    static ngAcceptInputType_blendSrc: THREE.BlendingSrcFactor | THREE.BlendingDstFactor| undefined;
    static ngAcceptInputType_blendSrcAlpha: number| undefined;
    static ngAcceptInputType_clipIntersection: boolean| undefined;
    static ngAcceptInputType_clippingPlanes: THREE.Plane[]| undefined;
    static ngAcceptInputType_clipShadows: boolean| undefined;
    static ngAcceptInputType_colorWrite: boolean| undefined;
    static ngAcceptInputType_defines: any| undefined;
    static ngAcceptInputType_depthFunc: THREE.DepthModes| undefined;
    static ngAcceptInputType_depthTest: boolean| undefined;
    static ngAcceptInputType_depthWrite: boolean| undefined;
    static ngAcceptInputType_name: string| undefined;
    static ngAcceptInputType_opacity: number| undefined;
    static ngAcceptInputType_polygonOffset: boolean| undefined;
    static ngAcceptInputType_polygonOffsetFactor: number| undefined;
    static ngAcceptInputType_polygonOffsetUnits: number| undefined;
    static ngAcceptInputType_precision: null| undefined;
    static ngAcceptInputType_premultipliedAlpha: boolean| undefined;
    static ngAcceptInputType_dithering: boolean| undefined;
    static ngAcceptInputType_side: THREE.Side| undefined;
    static ngAcceptInputType_shadowSide: THREE.Side| undefined;
    static ngAcceptInputType_toneMapped: boolean| undefined;
    static ngAcceptInputType_transparent: boolean| undefined;
    static ngAcceptInputType_vertexColors: boolean| undefined;
    static ngAcceptInputType_visible: boolean| undefined;
    static ngAcceptInputType_format: THREE.PixelFormat| undefined;
    static ngAcceptInputType_stencilWrite: boolean| undefined;
    static ngAcceptInputType_stencilFunc: THREE.StencilFunc| undefined;
    static ngAcceptInputType_stencilRef: number| undefined;
    static ngAcceptInputType_stencilWriteMask: number| undefined;
    static ngAcceptInputType_stencilFuncMask: number| undefined;
    static ngAcceptInputType_stencilFail: THREE.StencilOp| undefined;
    static ngAcceptInputType_stencilZFail: THREE.StencilOp| undefined;
    static ngAcceptInputType_stencilZPass: THREE.StencilOp| undefined;
    static ngAcceptInputType_userData: any| undefined;
}

function getInputs() {
    return [
        'bumpMap',
        'bumpScale',
        'color',
        'displacementMap',
        'displacementScale',
        'displacementBias',
        'emissive',
        'emissiveIntensity',
        'emissiveMap',
        'flatShading',
        'map',
        'lightMap',
        'lightMapIntensity',
        'normalMap',
        'normalScale',
        'aoMap',
        'aoMapIntensity',
        'specularMap',
        'alphaMap',
        'envMap',
        'combine',
        'reflectivity',
        'refractionRatio',
        'wireframe',
        'wireframeLinewidth',
        'wireframeLinecap',
        'wireframeLinejoin',
        'fog',
        'alphaTest',
        'alphaToCoverage',
        'blendDst',
        'blendDstAlpha',
        'blendEquation',
        'blendEquationAlpha',
        'blending',
        'blendSrc',
        'blendSrcAlpha',
        'clipIntersection',
        'clippingPlanes',
        'clipShadows',
        'colorWrite',
        'defines',
        'depthFunc',
        'depthTest',
        'depthWrite',
        'name',
        'opacity',
        'polygonOffset',
        'polygonOffsetFactor',
        'polygonOffsetUnits',
        'precision',
        'premultipliedAlpha',
        'dithering',
        'side',
        'shadowSide',
        'toneMapped',
        'transparent',
        'vertexColors',
        'visible',
        'format',
        'stencilWrite',
        'stencilFunc',
        'stencilRef',
        'stencilWriteMask',
        'stencilFuncMask',
        'stencilFail',
        'stencilZFail',
        'stencilZPass',
        'userData',
    ];
}
