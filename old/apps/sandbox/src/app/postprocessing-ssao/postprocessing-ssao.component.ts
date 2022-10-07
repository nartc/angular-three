import { NgtCanvas, NgtRadianPipe } from '@angular-three/core';
import { NgtBoxGeometry, NgtPlaneGeometry, NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtDirectionalLight } from '@angular-three/core/lights';
import { NgtMeshLambertMaterial, NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtStats } from '@angular-three/core/stats';
import { NgtEffectComposer, NgtEffectComposerContent } from '@angular-three/postprocessing';
import { NgtSSAOEffect } from '@angular-three/postprocessing/effects';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BlendFunction } from 'postprocessing';

@Component({
  selector: 'sandbox-wall',
  standalone: true,
  template: `
    <ngt-box-geometry #ngtGeometry [args]="[16, 12, 1]" noAttach></ngt-box-geometry>

    <ngt-mesh-lambert-material #ngtMaterial noAttach color="pink"></ngt-mesh-lambert-material>

    <ngt-mesh
      [position]="[0, 6, -3]"
      [geometry]="ngtGeometry.instance.value"
      [material]="ngtMaterial.instance.value"
      castShadow
      receiveShadow
    >
    </ngt-mesh>
    <ngt-mesh
      [position]="[-8, 6, 5]"
      [rotation]="[0, -90 | radian, 0]"
      [geometry]="ngtGeometry.instance.value"
      [material]="ngtMaterial.instance.value"
      castShadow
      receiveShadow
    >
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtBoxGeometry, NgtMeshLambertMaterial, NgtMesh, NgtRadianPipe],
})
export class Wall {}

@Component({
  selector: 'sandbox-small-box',
  standalone: true,
  template: `
    <ngt-mesh [position]="[6, 1, -1.5]" castShadow receiveShadow>
      <ngt-box-geometry [args]="[2, 2, 2]"></ngt-box-geometry>
      <ngt-mesh-lambert-material color="green"></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshLambertMaterial],
})
export class SmallBox {}

@Component({
  selector: 'sandbox-box',
  standalone: true,
  template: `
    <ngt-mesh [position]="[0, 2.5, 0]" castShadow receiveShadow>
      <ngt-box-geometry [args]="[5, 5, 5]"></ngt-box-geometry>
      <ngt-mesh-lambert-material color="red"></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshLambertMaterial],
})
export class Box {}

@Component({
  selector: 'sandbox-ground',
  standalone: true,
  template: `
    <ngt-mesh [rotation]="[-90 | radian, 0, 0]" receiveShadow>
      <ngt-plane-geometry [args]="[100, 1000]"></ngt-plane-geometry>
      <ngt-mesh-standard-material color="#ddddff"></ngt-mesh-standard-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtMesh, NgtPlaneGeometry, NgtMeshStandardMaterial, NgtRadianPipe],
})
export class Ground {}

@Component({
  selector: 'sandbox-ball',
  standalone: true,
  template: `
    <ngt-mesh [position]="[1, 6, -1]" castShadow receiveShadow>
      <ngt-sphere-geometry [args]="[1, 128, 128]"></ngt-sphere-geometry>
      <ngt-mesh-lambert-material color="yellow"></ngt-mesh-lambert-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtMesh, NgtSphereGeometry, NgtMeshLambertMaterial],
})
export class Ball {}

@Component({
  selector: 'sandbox-scene[blendFunction]',
  standalone: true,
  template: `
    <ngt-directional-light castShadow [position]="[2.5, 5, 5]"></ngt-directional-light>

    <sandbox-small-box></sandbox-small-box>
    <sandbox-box></sandbox-box>
    <sandbox-ball></sandbox-ball>
    <sandbox-wall></sandbox-wall>
    <sandbox-ground></sandbox-ground>

    <ngt-effect-composer>
      <ng-template ngt-effect-composer-content>
        <ngt-ssao-effect [blendFunction]="blendFunction" intensity="30" samples="31" radius="5"></ngt-ssao-effect>
      </ng-template>
    </ngt-effect-composer>

    <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtDirectionalLight,
    SmallBox,
    Box,
    Wall,
    Ground,
    NgtEffectComposer,
    NgtEffectComposerContent,
    NgtSSAOEffect,
    NgtSobaOrbitControls,
    Ball,
  ],
})
export class Scene {
  @Input() blendFunction!: BlendFunction;
}

@Component({
  selector: 'sandbox-postprocessing-ssao',
  standalone: true,
  template: `
    <button class="px-4 py-2 rounded bg-gray-300" (click)="toggle()">
      Toggle BlendFunction (current: {{ blendFunctionName }})
    </button>
    <div style="height: 400px; width: 400px">
      <ngt-canvas [camera]="{ position: [10, 10, 10] }">
        <sandbox-scene [blendFunction]="blendFunction"></sandbox-scene>
      </ngt-canvas>
      <ngt-stats></ngt-stats>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtCanvas, Scene, NgtStats],
})
export class PostProcessingSSAOComponent {
  blendFunction = BlendFunction.NORMAL;

  get blendFunctionName() {
    return this.blendFunction === BlendFunction.NORMAL ? 'NORMAL' : 'MULTIPLY';
  }

  toggle() {
    this.blendFunction = this.blendFunction === BlendFunction.NORMAL ? BlendFunction.MULTIPLY : BlendFunction.NORMAL;
  }
}
