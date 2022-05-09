import { NgtCanvasModule, NgtLoader } from '@angular-three/core';
import { NgtSphereGeometryModule } from '@angular-three/core/geometries';
import { NgtSpotLightModule } from '@angular-three/core/lights';
import { NgtMeshPhysicalMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtEffectComposerModule } from '@angular-three/postprocessing';
import { NgtLUTEffectModule } from '@angular-three/postprocessing/effects';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtSobaLoaderModule, NgtTextureLoader } from '@angular-three/soba/loaders';
import { NgtSobaEnvironmentModule } from '@angular-three/soba/staging';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LookupTexture, LUTCubeLoader } from 'postprocessing';
import { Observable } from 'rxjs';

@Component({
  selector: 'sandbox-color-grading',
  template: `
    <ngt-canvas frameloop="demand" [dpr]="[1, 2]" [camera]="{ position: [0, 0, 5], fov: 45 }">
      <sandbox-scene></sandbox-scene>
    </ngt-canvas>
    <ngt-soba-loader></ngt-soba-loader>
    <ngt-stats></ngt-stats>
  `,
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

@Component({
  selector: 'sandbox-scene',
  template: `
    <ngt-spot-light intensity="0.5" angle="0.2" penumbra="1" [position]="[5, 15, 10]"></ngt-spot-light>

    <sandbox-sphere></sandbox-sphere>
    <sandbox-grading></sandbox-grading>
    <ngt-soba-environment preset="warehouse"></ngt-soba-environment>

    <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scene {}

@Component({
  selector: 'sandbox-grading',
  template: `
    <ngt-effect-composer>
      <ng-template ngt-effect-composer-content>
        <ngt-lut-effect *ngIf="texture$ | async as texture" [lut]="texture"></ngt-lut-effect>
      </ng-template>
    </ngt-effect-composer>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Grading {
  readonly texture$ = this.loader.use(LUTCubeLoader, 'assets/cubicle-99.CUBE') as Observable<LookupTexture>;

  constructor(private loader: NgtLoader) {}
}

@Component({
  selector: 'sandbox-sphere',
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtTextureLoader],
})
export class Sphere {
  readonly texture$ = this.textureLoader.load('assets/terrazo.png');

  constructor(private textureLoader: NgtTextureLoader) {}
}

@NgModule({
  declarations: [ColorGradingComponent, Scene, Grading, Sphere],
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: ColorGradingComponent,
      },
    ]),
    CommonModule,
    NgtEffectComposerModule,
    NgtLUTEffectModule,
    NgtMeshModule,
    NgtSphereGeometryModule,
    NgtMeshPhysicalMaterialModule,
    NgtCanvasModule,
    NgtSpotLightModule,
    NgtSobaOrbitControlsModule,
    NgtSobaEnvironmentModule,
    NgtSobaLoaderModule,
    NgtStatsModule,
  ],
  exports: [Sphere],
})
export class ColorGradingComponentModule {}
