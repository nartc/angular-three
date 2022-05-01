import { NgtCanvasModule } from '@angular-three/core';
import { NgtColorAttributeModule } from '@angular-three/core/attributes';
import { NgtGroupModule } from '@angular-three/core/group';
import {
    NgtAmbientLightModule,
    NgtDirectionalLightModule,
} from '@angular-three/core/lights';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtEffectComposerModule } from '@angular-three/postprocessing';
import {
    NgtBloomModule,
    NgtNoiseModule,
    NgtSSAOModule,
} from '@angular-three/postprocessing/effects';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import {
    NgtGLTFLoader,
    NgtSobaLoaderModule,
} from '@angular-three/soba/loaders';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import * as THREE from 'three';

@Component({
    selector: 'sandbox-keen-bloom',
    template: `
        <ngt-canvas [camera]="{ position: [0, 0, 15], near: 5, far: 20 }">
            <ngt-color attach="background" color="black"></ngt-color>

            <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
            <sandbox-keen></sandbox-keen>

            <ngt-ambient-light></ngt-ambient-light>
            <ngt-directional-light
                [position]="[0, 1, 2]"
                color="white"
            ></ngt-directional-light>

            <ngt-effect-composer>
                <ngt-bloom></ngt-bloom>
            </ngt-effect-composer>
        </ngt-canvas>
        <ngt-soba-loader></ngt-soba-loader>
        <ngt-stats></ngt-stats>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeenBloomComponent {}

@Component({
    selector: 'sandbox-keen',
    template: `
        <ng-container *ngIf="keen$ | async as keen">
            <ngt-group
                (ready)="onReady($event)"
                (beforeRender)="onGroupAnimate($event.object)"
                [position]="[0, -7, 0]"
                [dispose]="null"
            >
                <ngt-mesh
                    [material]="keen.materials['Scene_-_Root']"
                    [geometry]="$any(keen.nodes['mesh_0']).geometry"
                    castShadow
                    receiveShadow
                ></ngt-mesh>
            </ngt-group>
        </ng-container>
    `,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeenComponent {
    keen$ = this.gltfLoader.load('assets/scene.gltf');

    constructor(private gltfLoader: NgtGLTFLoader) {}

    onGroupAnimate(group: THREE.Object3D) {
        group.rotation.z += 0.01;
    }

    onReady(group: THREE.Group) {
        group.rotation.y = 0;
        group.rotation.x = -Math.PI / 2;
    }
}

@NgModule({
    declarations: [KeenBloomComponent, KeenComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([{ path: '', component: KeenBloomComponent }]),
        NgtCanvasModule,
        NgtGroupModule,
        NgtMeshModule,
        NgtAmbientLightModule,
        NgtDirectionalLightModule,
        NgtEffectComposerModule,
        NgtBloomModule,
        NgtStatsModule,
        NgtNoiseModule,
        NgtSobaLoaderModule,
        NgtSobaOrbitControlsModule,
        NgtColorAttributeModule,
        NgtSSAOModule,
    ],
})
export class KeenComponentModule {}
