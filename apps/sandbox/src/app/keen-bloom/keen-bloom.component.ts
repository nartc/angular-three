import { NgtCanvas } from '@angular-three/core';
import { NgtColorAttribute } from '@angular-three/core/attributes';
import { NgtGroup } from '@angular-three/core/group';
import { NgtAmbientLight, NgtDirectionalLight } from '@angular-three/core/lights';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtStats } from '@angular-three/core/stats';
import { NgtEffectComposer, NgtEffectComposerContent } from '@angular-three/postprocessing';
import { NgtBloomEffect } from '@angular-three/postprocessing/effects';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgtGLTFLoader, NgtSobaLoader } from '@angular-three/soba/loaders';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'sandbox-keen',
  standalone: true,
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
  imports: [NgIf, AsyncPipe, NgtGroup, NgtMesh],
})
export class Keen {
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

@Component({
  selector: 'sandbox-scene',
  standalone: true,
  template: `
    <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
    <sandbox-keen></sandbox-keen>

    <ngt-ambient-light></ngt-ambient-light>
    <ngt-directional-light [position]="[0, 1, 2]" color="white"></ngt-directional-light>

    <ngt-effect-composer>
      <ng-template ngt-effect-composer-content>
        <ngt-bloom-effect></ngt-bloom-effect>
      </ng-template>
    </ngt-effect-composer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtSobaOrbitControls,
    Keen,
    NgtAmbientLight,
    NgtDirectionalLight,
    NgtEffectComposer,
    NgtEffectComposerContent,
    NgtBloomEffect,
  ],
})
export class Scene {}

@Component({
  selector: 'sandbox-keen-bloom',
  standalone: true,
  template: `
    <ngt-canvas initialLog [camera]="{ position: [0, 0, 15], near: 5, far: 20 }">
      <ngt-color attach="background" color="black"></ngt-color>

      <sandbox-scene></sandbox-scene>
    </ngt-canvas>
    <ngt-soba-loader></ngt-soba-loader>
    <ngt-stats></ngt-stats>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtCanvas, NgtColorAttribute, Scene, NgtSobaLoader, NgtStats],
})
export class KeenBloomComponent {}
