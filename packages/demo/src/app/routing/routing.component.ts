import {
  NgtCoreModule,
  NgtCursorModule,
  NgtMathPipeModule,
} from '@angular-three/core';
import {
  NgtDirectionalLightHelperModule,
  NgtHemisphereLightHelperModule,
} from '@angular-three/core/helpers';
import {
  NgtDirectionalLightModule,
  NgtHemisphereLightModule,
} from '@angular-three/core/lights';
import { NgtMeshPhongMaterialModule } from '@angular-three/core/materials';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtGLTFLoaderService } from '@angular-three/soba/loaders';
import { NgtSobaPlaneModule } from '@angular-three/soba/shapes';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';

@Component({
  selector: 'ngt-routing',
  template: `
    <!--    {x:8.978268137976093, y:1.4259925772313005, z:2.766455512629831}-->
    <ngt-canvas
      [shadows]="true"
      [camera]="{
        position: [8.978268137976093, 1.4259925772313005, 2.766455512629831]
      }"
    >
      <!--      <tjs-mesh #ground-->
      <!--                [receiveShadow]="true"-->
      <!--                [material]="{color: 'white', side:'both'|side, depthWrite:false}|meshPhongMaterial"-->
      <!--                [rotation]="{x:90|radians, y:0, z:0}|vector3"-->
      <!--                [geometry]="{width: 100, height: 100}|planeBufferGeometry">-->
      <!--      </tjs-mesh>-->

      <ngt-soba-plane
        [args]="[100, 100]"
        [receiveShadow]="true"
        [rotation]="[0.5 | mathConst: 'PI', 0, 0]"
      >
        <ngt-mesh-phong-material
          [parameters]="{ depthWrite: false, side: side, color: 'white' }"
        ></ngt-mesh-phong-material>
      </ngt-soba-plane>

      <ngt-soba-orbit-controls
        (ready)="onOrbitControlsReady($event)"
        [target]="[0, 1, 0]"
      ></ngt-soba-orbit-controls>

      <ngt-hemisphere-light
        ngtHemisphereLightHelper
        [position]="[10, 10, 10]"
        [args]="['#ffffff', '#ffffff', 0.2]"
      ></ngt-hemisphere-light>

      <ngt-directional-light
        ngtDirectionalLightHelper
        [castShadow]="true"
        [position]="[10, 10, 10]"
      ></ngt-directional-light>

      <ngt-primitive
        *ngIf="rock$ | async as rock"
        ngtCursor
        [object]="rock.scene"
        [position]="[0, 2.6, 0]"
        [scale]="[3, 3, 3]"
        [castShadow]="true"
        [receiveShadow]="true"
      ></ngt-primitive>

      <router-outlet></router-outlet>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoutingComponent {
  rock$ = this.gltfLoaderService.load('/assets/rock2/scene.gltf');
  side = THREE.DoubleSide;
  colors = [
    {
      color: '#042A2B',
      label: 'Rich Black',
    },
    {
      color: '#5EB1BF',
      label: 'Maximum Blue',
    },
    {
      color: '#CDEDF6',
      label: 'Light Cyan',
    },
    {
      color: '#EF7B45',
      label: 'Mandarin',
    },
    {
      color: '#D84727',
      label: 'Vermilion',
    },
  ];

  onOrbitControlsReady(controls: OrbitControls) {
    controls.minDistance = 12;
    controls.maxDistance = 12;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = (100 * Math.PI) / 180;
  }

  constructor(private gltfLoaderService: NgtGLTFLoaderService) {}
}

@NgModule({
  declarations: [RoutingComponent],
  exports: [RoutingComponent],
  imports: [
    CommonModule,
    NgtCoreModule,
    NgtSobaPlaneModule,
    NgtMeshPhongMaterialModule,
    NgtSobaOrbitControlsModule,
    NgtHemisphereLightModule,
    NgtDirectionalLightModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'cube', pathMatch: 'full' },
      {
        path: 'cube',
        loadChildren: () =>
          import('./routed-cube.component').then(
            (m) => m.RoutedCubeComponentModule
          ),
      },
    ]),
    NgtHemisphereLightHelperModule,
    NgtDirectionalLightHelperModule,
    NgtPrimitiveModule,
    NgtCursorModule,
    NgtMathPipeModule,
  ],
})
export class RoutingComponentModule {}
