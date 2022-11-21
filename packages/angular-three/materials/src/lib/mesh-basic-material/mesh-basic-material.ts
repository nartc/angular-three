import { NGT_INSTANCE_HOST_DIRECTIVE, provideInstanceRef, proxify } from 'angular-three';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
    selector: 'ngt-mesh-basic-material',
    standalone: true,
    template: '<ng-content></ng-content>',
    hostDirectives: [NGT_INSTANCE_HOST_DIRECTIVE],
    providers: [provideInstanceRef(NgtMeshBasicMaterial)],
    inputs: [
        'color',
        'map',
        'opacity',
        'lightMap',
        'lightMapIntensity',
        'aoMap',
        'aoMapIntensity',
        'specularMap',
        'alphaMap',
        'fog',
        'envMap',
        'combine',
        'reflectivity',
        'refractionRatio',
        'wireframe',
        'wireframeLinewidth',
        'wireframeLinecap',
        'wireframeLinejoin',
        'toneMapped',
        'vertexColors',
    ],
})
export class NgtMeshBasicMaterial extends THREE.MeshBasicMaterial {
    constructor() {
        super();
        return proxify(this, { attach: 'material' });
    }

    static ngAcceptInputType_color: THREE.ColorRepresentation;
    static ngAcceptInputType_map: THREE.Texture | null | undefined;
    static ngAcceptInputType_opacity: number | undefined;
    static ngAcceptInputType_lightMap: THREE.Texture | null;
    static ngAcceptInputType_lightMapIntensity: number | undefined;
    static ngAcceptInputType_aoMap: THREE.Texture | null | undefined;
    static ngAcceptInputType_aoMapIntensity: number | undefined;
    static ngAcceptInputType_specularMap: THREE.Texture | null | undefined;
    static ngAcceptInputType_alphaMap: THREE.Texture | null | undefined;
    static ngAcceptInputType_fog: boolean | undefined;
    static ngAcceptInputType_envMap: THREE.Texture | null | undefined;
    static ngAcceptInputType_combine: THREE.Combine | undefined;
    static ngAcceptInputType_reflectivity: number | undefined;
    static ngAcceptInputType_refractionRatio: number | undefined;
    static ngAcceptInputType_wireframe: boolean | undefined;
    static ngAcceptInputType_wireframeLinewidth: number | undefined;
    static ngAcceptInputType_wireframeLinecap: string | undefined;
    static ngAcceptInputType_wireframeLinejoin: string | undefined;
    static ngAcceptInputType_toneMapped: boolean | undefined;
    static ngAcceptInputType_vertexColors: boolean | undefined;
}
