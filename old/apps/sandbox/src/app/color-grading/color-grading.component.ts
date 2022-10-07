import { NgtCanvas, NgtLoader } from '@angular-three/core';
import { NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtSpotLight } from '@angular-three/core/lights';
import { NgtMeshPhysicalMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtStats } from '@angular-three/core/stats';
import { NgtEffectComposer, NgtEffectComposerContent } from '@angular-three/postprocessing';
import { NgtLUTEffect } from '@angular-three/postprocessing/effects';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { NgtSobaLoader, NgtTextureLoader } from '@angular-three/soba/loaders';
import { NgtSobaEnvironment } from '@angular-three/soba/staging';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LookupTexture, LUTCubeLoader } from 'postprocessing';
import { Observable } from 'rxjs';

@Component({
  selector: 'sandbox-sphere',
  standalone: true,
  template: `
    <ngt-mesh>
      <ngt-sphere-geometry [args]="[1, 64, 64]"></ngt-sphere-geometry>
      <ngt-mesh-physical-material
        [map]="(texture$ | async)!"
        envMapIntensity="0.4"
        clearcoat="0.8"
        clearcoatRoughness="0"
        roughness="1"
        metalness="0"
      ></ngt-mesh-physical-material>
    </ngt-mesh>
  `,
  imports: [NgtMesh, NgtSphereGeometry, NgtMeshPhysicalMaterial, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtTextureLoader],
})
export class Sphere {
  readonly texture$ = this.textureLoader.load('assets/terrazo.png');
  constructor(private textureLoader: NgtTextureLoader) {}
}

@Component({
  selector: 'sandbox-grading',
  standalone: true,
  template: `
    <ngt-effect-composer>
      <ng-template ngt-effect-composer-content>
        <ngt-lut-effect *ngIf="texture$ | async as texture" [lut]="texture"></ngt-lut-effect>
      </ng-template>
    </ngt-effect-composer>
  `,
  imports: [NgtEffectComposer, NgtEffectComposerContent, NgtLUTEffect, NgIf, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grading {
  readonly texture$ = this.loader.use(LUTCubeLoader, 'assets/cubicle-99.CUBE') as Observable<LookupTexture>;
  constructor(private loader: NgtLoader) {}
}

@Component({
  selector: 'sandbox-scene',
  standalone: true,
  template: `
    <ngt-spot-light intensity="0.5" angle="0.2" penumbra="1" [position]="[5, 15, 10]"></ngt-spot-light>

    <sandbox-sphere></sandbox-sphere>
    <sandbox-grading></sandbox-grading>
    <ngt-soba-environment preset="warehouse"></ngt-soba-environment>

    <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
  `,
  imports: [NgtSpotLight, NgtSobaEnvironment, NgtSobaOrbitControls, Sphere, Grading],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scene {}

@Component({
  selector: 'sandbox-color-grading',
  standalone: true,
  template: `
    <ngt-canvas frameloop="demand" [dpr]="[1, 2]" [camera]="{ position: [0, 0, 5], fov: 45 }">
      <sandbox-scene></sandbox-scene>
    </ngt-canvas>
    <ngt-soba-loader></ngt-soba-loader>
    <ngt-stats></ngt-stats>
  `,
  imports: [NgtCanvas, NgtSobaLoader, NgtStats, Scene],
  styles: [
    `
      :host {
        display: block;
        height: 100%;
        width: 100%;
        background-image: linear-gradient(-225deg, #cbbacc 0%, #2580b3 100%);
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorGradingComponent {}
