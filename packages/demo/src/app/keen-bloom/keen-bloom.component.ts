import { NgtColorPipeModule, NgtCoreModule } from '@angular-three/core';
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
} from '@angular-three/postprocessing/effects';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import {
  NgtGLTFLoader,
  NgtSobaLoaderModule,
} from '@angular-three/soba/loaders';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'demo-keen-bloom',
  template: `
    <ngt-canvas
      [camera]="{ position: [0, 0, 15], near: 5, far: 20 }"
      [scene]="{ background: 'black' | color }"
    >
      <ngt-stats></ngt-stats>
      <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
      <demo-keen></demo-keen>

      <ngt-ambient-light></ngt-ambient-light>
      <ngt-directional-light
        [position]="[0, 1, 2]"
        color="white"
      ></ngt-directional-light>

      <ngt-effect-composer>
        <ngt-bloom></ngt-bloom>
        <ngt-noise [options]="{ premultiply: true }"></ngt-noise>
      </ngt-effect-composer>
    </ngt-canvas>
    <ngt-soba-loader></ngt-soba-loader>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KeenBloomComponent {}

@Component({
  selector: 'demo-keen',
  template: `
    <ng-container *ngIf="keen$ | async as keen">
      <ngt-group
        (ready)="onReady($event)"
        (animateReady)="onGroupAnimate($event.object)"
        [position]="[0, -7, 0]"
        [dispose]="null"
      >
        <ngt-mesh
          [material]="keen.materials['Scene_-_Root']"
          [geometry]="$any(keen.nodes['mesh_0']).geometry"
          [castShadow]="true"
          [receiveShadow]="true"
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
  exports: [KeenBloomComponent],
  imports: [
    CommonModule,
    NgtCoreModule,
    NgtGroupModule,
    NgtMeshModule,
    NgtAmbientLightModule,
    NgtDirectionalLightModule,
    NgtEffectComposerModule,
    NgtBloomModule,
    NgtStatsModule,
    NgtNoiseModule,
    NgtSobaLoaderModule,
    NgtColorPipeModule,
    NgtSobaOrbitControlsModule,
  ],
})
export class KeenComponentModule {}
