// GENERATED - AngularThree v1.0.0
import { NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-shadow-material',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtShadowMaterial)],
    inputs: [...getInputs()],
})
export class NgtShadowMaterial extends THREE.ShadowMaterial {
    constructor() {
        super();
        return proxify(this, { attach: 'material' });
    }

    
    static ngAcceptInputType_color: THREE.ColorRepresentation| undefined;
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
        'color',
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
