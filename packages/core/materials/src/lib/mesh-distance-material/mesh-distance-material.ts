// GENERATED - AngularThree v1.0.0
import { NgtInstance, provideInstanceRef, proxify, NgtVector3, NgtObservableInput } from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';
import { NGT_INSTANCE_INPUTS } from '../common';

@Component({
    selector: 'ngt-mesh-distance-material',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [{ directive: NgtInstance, inputs: NGT_INSTANCE_INPUTS }],
    providers: [provideInstanceRef(NgtMeshDistanceMaterial)],
    inputs: [...getInputs()],
})
export class NgtMeshDistanceMaterial extends THREE.MeshDistanceMaterial {
    constructor() {
        super();
        return proxify(this, { attach: 'material' });
    }

    static ngAcceptInputType_map: NgtObservableInput<THREE.Texture | null> | undefined;
    static ngAcceptInputType_alphaMap: NgtObservableInput<THREE.Texture | null> | undefined;
    static ngAcceptInputType_displacementMap: NgtObservableInput<THREE.Texture | null> | undefined;
    static ngAcceptInputType_displacementScale: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_displacementBias: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_farDistance: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_nearDistance: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_referencePosition: NgtObservableInput<NgtVector3> | undefined;
    static ngAcceptInputType_alphaTest: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_alphaToCoverage: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_blendDst: NgtObservableInput<THREE.BlendingDstFactor> | undefined;
    static ngAcceptInputType_blendDstAlpha: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_blendEquation: NgtObservableInput<THREE.BlendingEquation> | undefined;
    static ngAcceptInputType_blendEquationAlpha: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_blending: NgtObservableInput<THREE.Blending> | undefined;
    static ngAcceptInputType_blendSrc:
        | NgtObservableInput<THREE.BlendingSrcFactor | THREE.BlendingDstFactor>
        | undefined;
    static ngAcceptInputType_blendSrcAlpha: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_clipIntersection: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_clippingPlanes: NgtObservableInput<THREE.Plane[]> | undefined;
    static ngAcceptInputType_clipShadows: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_colorWrite: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_defines: NgtObservableInput<any> | undefined;
    static ngAcceptInputType_depthFunc: NgtObservableInput<THREE.DepthModes> | undefined;
    static ngAcceptInputType_depthTest: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_depthWrite: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_name: NgtObservableInput<string> | undefined;
    static ngAcceptInputType_opacity: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_polygonOffset: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_polygonOffsetFactor: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_polygonOffsetUnits: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_precision: NgtObservableInput<null> | undefined;
    static ngAcceptInputType_premultipliedAlpha: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_dithering: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_side: NgtObservableInput<THREE.Side> | undefined;
    static ngAcceptInputType_shadowSide: NgtObservableInput<THREE.Side> | undefined;
    static ngAcceptInputType_toneMapped: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_transparent: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_vertexColors: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_visible: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_format: NgtObservableInput<THREE.PixelFormat> | undefined;
    static ngAcceptInputType_stencilWrite: NgtObservableInput<boolean> | undefined;
    static ngAcceptInputType_stencilFunc: NgtObservableInput<THREE.StencilFunc> | undefined;
    static ngAcceptInputType_stencilRef: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_stencilWriteMask: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_stencilFuncMask: NgtObservableInput<number> | undefined;
    static ngAcceptInputType_stencilFail: NgtObservableInput<THREE.StencilOp> | undefined;
    static ngAcceptInputType_stencilZFail: NgtObservableInput<THREE.StencilOp> | undefined;
    static ngAcceptInputType_stencilZPass: NgtObservableInput<THREE.StencilOp> | undefined;
    static ngAcceptInputType_userData: NgtObservableInput<any> | undefined;
}

function getInputs() {
    return [
        'map',
        'alphaMap',
        'displacementMap',
        'displacementScale',
        'displacementBias',
        'farDistance',
        'nearDistance',
        'referencePosition',
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
