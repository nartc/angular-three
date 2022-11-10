import { NgtCanvas, NgtRadianPipe } from '@angular-three/core';
import { NgtColorAttribute, NgtValueAttribute } from '@angular-three/core/attributes';
import { NgtAmbientLight, NgtDirectionalLight } from '@angular-three/core/lights';
import { NgtGroup, NgtMesh } from '@angular-three/core/objects';
import { NgtStats } from '@angular-three/core/stats';
import { NgtEffectComposer } from '@angular-three/postprocessing';
import { NgtBloomEffect } from '@angular-three/postprocessing/effects';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgtGLTFLoader, NgtSobaLoader } from '@angular-three/soba/loaders';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'keen',
  standalone: true,
  template: `
    <ng-container *ngIf="keen$ | async as keen">
      <ngt-group (beforeRender)="onGroupAnimate($event.object)" [position]="[0, -7, 0]" [dispose]="null">
        <ngt-value [attach]="['rotation', 'x']" [value]="-90 | radian"></ngt-value>

        <ngt-mesh
          [material]="keen.materials['Scene_-_Root']"
          [geometry]="$any(keen.nodes['mesh_0']).geometry"
          castShadow
          receiveShadow
        ></ngt-mesh>
      </ngt-group>
    </ng-container>
  `,
  imports: [NgIf, AsyncPipe, NgtGroup, NgtMesh, NgtValueAttribute, NgtRadianPipe],
})
class Keen {
  readonly keen$ = inject(NgtGLTFLoader).load('assets/scene.gltf');

  onGroupAnimate(group: THREE.Group) {
    group.rotation.z += 0.01;
  }
}

@Component({
  selector: 'scene',
  standalone: true,
  template: `
    <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
    <keen></keen>

    <ngt-ambient-light></ngt-ambient-light>
    <ngt-directional-light [position]="[0, 1, 2]" color="white"></ngt-directional-light>

    <ngt-effect-composer>
      <ngt-bloom-effect></ngt-bloom-effect>
    </ngt-effect-composer>
  `,
  imports: [NgtSobaOrbitControls, NgtAmbientLight, NgtDirectionalLight, NgtEffectComposer, NgtBloomEffect, Keen],
})
class Scene {}

@Component({
  selector: 'sandbox-keen-bloom',
  standalone: true,
  template: `
    <ngt-canvas initialLog [camera]="{ position: [0, 0, 15], near: 5, far: 20 }">
      <ngt-color attach="background" color="black"></ngt-color>
      <scene></scene>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
    <ngt-soba-loader></ngt-soba-loader>
  `,
  imports: [NgtCanvas, NgtColorAttribute, NgtStats, Scene, NgtSobaLoader],
})
export default class SandboxKeenBloom {}
