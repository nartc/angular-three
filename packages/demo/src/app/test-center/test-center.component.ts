import { NgtColorPipeModule, NgtCoreModule, provideCanvasOptions } from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtAmbientLightModule, NgtPointLightModule } from '@angular-three/core/lights';
import { NgtMeshNormalMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtGLTFLoader, NgtSobaLoaderModule } from '@angular-three/soba/loaders';
import { NgtSobaCenterModule } from '@angular-three/soba/staging';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'demo-test-center',
  template: `
    <ngt-canvas
      [camera]='{ position: [0, 0, -10] }'
      [scene]="{ background: 'black' | color }"
    >
      <ngt-stats></ngt-stats>

      <ngt-ambient-light [intensity]='0.8'></ngt-ambient-light>
      <ngt-point-light [intensity]='1' [position]='[0, 6, 0]'></ngt-point-light>

      <ngt-soba-center
        *ngIf='node$ | async as node'
        [position]='[5, 5, 10]'
      >
        <ng-template sobaCenterContent>
          <ngt-mesh>
            <ngt-box-geometry [args]='[10, 10, 10]'></ngt-box-geometry>
            <ngt-mesh-normal-material
              [parameters]='{ wireframe: true }'
            ></ngt-mesh-normal-material>
          </ngt-mesh>
          <ngt-primitive
            [object]='node.scene'
            [scale]='[0.01, 0.01, 0.01]'
            (animateReady)='onTokyoAnimated($event.object)'
          ></ngt-primitive>
        </ng-template>
      </ngt-soba-center>

      <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
    </ngt-canvas>

    <ngt-soba-loader></ngt-soba-loader>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCanvasOptions({ initialLog: true })]
})
export class TestCenterComponent {
  node$ = this.gltfLoader.load('/assets/LittlestTokyo.glb');

  constructor(private gltfLoader: NgtGLTFLoader) {
  }

  onTokyoAnimated(scene: THREE.Object3D) {
    scene.rotation.y += 0.01;
  }
}

@NgModule({
  declarations: [TestCenterComponent],
  exports: [TestCenterComponent],
  imports: [
    NgtCoreModule,
    NgtColorPipeModule,
    NgtStatsModule,
    NgtAmbientLightModule,
    NgtPointLightModule,
    NgtSobaOrbitControlsModule,
    CommonModule,
    NgtSobaCenterModule,
    NgtMeshNormalMaterialModule,
    NgtPrimitiveModule,
    NgtSobaLoaderModule,
    NgtBoxGeometryModule,
    NgtMeshModule
  ]
})
export class TestCenterComponentModule {
}
