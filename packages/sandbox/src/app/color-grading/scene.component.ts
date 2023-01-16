import { extend, injectNgtLoader, NgtArgs, NgtPush } from '@angular-three/core';
import { NgtpEffectComposer } from '@angular-three/postprocessing';
import { NgtpLUT } from '@angular-three/postprocessing/effects';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { injectNgtsTextureLoader } from '@angular-three/soba/loaders';
import { NgtsEnvironment } from '@angular-three/soba/staging';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { LookupTexture, LUTCubeLoader } from 'postprocessing';
import { Observable } from 'rxjs';
import { Mesh, MeshPhysicalMaterial, SphereGeometry } from 'three';

extend({ Mesh, SphereGeometry, MeshPhysicalMaterial });

@Component({
    selector: 'sandbox-sphere',
    standalone: true,
    template: `
        <ngt-mesh>
            <ngt-sphere-geometry *args="[1, 64, 64]" />
            <ngt-mesh-physical-material
                *ngIf="texture$ | ngtPush : null as texture"
                [map]="texture"
                envMapIntensity="0.4"
                clearcoat="0.8"
                clearcoatRoughness="0"
                roughness="1"
                metalness="0"
            />
        </ngt-mesh>
    `,
    imports: [NgtArgs, NgtPush, NgIf],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Sphere {
    readonly texture$ = injectNgtsTextureLoader('assets/terrazo.png');
}

@Component({
    selector: 'sandbox-grading',
    standalone: true,
    template: `
        <ngtp-effect-composer>
            <ngtp-lut *ngIf="texture$ | ngtPush : null as texture" [lut]="texture" />
        </ngtp-effect-composer>
    `,
    imports: [NgtpLUT, NgtpEffectComposer, NgtPush, NgIf],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Grading {
    readonly texture$ = injectNgtLoader(() => LUTCubeLoader, 'assets/cubicle-99.CUBE') as Observable<LookupTexture>;
}

@Component({
    selector: 'sandbox-color-grading-scene',
    standalone: true,
    template: `
        <ngt-spot-light intensity="0.5" angle="0.2" penumbra="1" [position]="[5, 15, 10]" />
        <sandbox-sphere />
        <sandbox-grading />
        <ngts-environment preset="warehouse" />
        <ngts-orbit-controls />
    `,
    imports: [Sphere, Grading, NgtsEnvironment, NgtsOrbitControls],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}
