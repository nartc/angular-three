import { extend, NgtArgs, NgtPush } from '@angular-three/core';
import { NgtpEffectComposer } from '@angular-three/postprocessing';
import { NgtpBloom, NgtpDepth, NgtpDotScreen } from '@angular-three/postprocessing/effects';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { injectNgtsGLTFLoader } from '@angular-three/soba/loaders';
import { NgIf } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AmbientLight, Color, DirectionalLight, Group, Mesh } from 'three';

extend({ Group, Mesh, AmbientLight, DirectionalLight, Color });

@Component({
    selector: 'sandbox-keen',
    standalone: true,
    template: `
        <ng-container *ngIf="keen$ | ngtPush : null as keen">
            <ngt-group [position]="[0, -7, 0]" [dispose]="null" (beforeRender)="onBeforeRender($any($event).object)">
                <ngt-value attach="rotation.x" [rawValue]="-Math.PI / 2" />
                <ngt-mesh
                    [material]="keen.materials['Scene_-_Root']"
                    [geometry]="$any(keen.nodes['mesh_0']).geometry"
                    castShadow
                    receiveShadow
                />
            </ngt-group>
        </ng-container>
    `,
    imports: [NgtArgs, NgtPush, NgIf],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Keen {
    readonly Math = Math;
    readonly keen$ = injectNgtsGLTFLoader('assets/keen/scene.gltf');

    onBeforeRender(group: Group) {
        group.rotation.z += 0.01;
    }
}

@Component({
    selector: 'sandbox-keen-bloom-scene',
    standalone: true,
    template: `
        <ngt-color *args="['black']" attach="background" />
        <ngts-orbit-controls />
        <sandbox-keen />

        <ngt-ambient-light />
        <ngt-directional-light [position]="[0, 1, 2]" color="white" />

        <ngtp-effect-composer>
            <ngtp-bloom [intensity]="5" />
            <ngtp-depth [inverted]="false" />
            <ngtp-dot-screen [scale]="3" />
        </ngtp-effect-composer>
    `,
    imports: [Keen, NgtsOrbitControls, NgtpEffectComposer, NgtpDepth, NgtpDotScreen, NgtpBloom, NgtArgs],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}
