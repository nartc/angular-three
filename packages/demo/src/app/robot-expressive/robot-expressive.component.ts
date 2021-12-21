import {
  NgtColorPipeModule,
  NgtCoreModule,
  NgtFogPipeModule,
  NgtMathPipeModule,
} from '@angular-three/core';
import { NgtGridHelperModule } from '@angular-three/core/helpers';
import {
  NgtDirectionalLightModule,
  NgtHemisphereLightModule,
} from '@angular-three/core/lights';
import { NgtMeshPhongMaterialModule } from '@angular-three/core/materials';
import { NgtPrimitiveModule } from '@angular-three/core/primitive';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaLoaderModule } from '@angular-three/soba/loaders';
import { NgtSobaPlaneModule } from '@angular-three/soba/shapes';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { NgxLilGuiModule } from 'ngx-lil-gui';
import { GridHelper, Material } from 'three';
import { RobotGuiComponent } from './robot-gui.component';
import { RobotComponent } from './robot.component';

@Component({
  selector: 'ngt-robot-expressive',
  template: `
    <ngt-canvas
      (created)="$event.camera.lookAt(0, 2, 0)"
      [shadows]="true"
      [camera]="{ fov: 45, near: 0.25, far: 100, position: [-5, 5, 10] }"
      [scene]="{
        background: '#e0e0e0' | color,
        fog: ['#e0e0e0', 20, 100] | fog
      }"
    >
      <!--      stats-->
      <ngt-stats></ngt-stats>

      <!--      lights-->
      <ngt-hemisphere-light
        [args]="['#ffffff', '#444444']"
        [position]="[0, 20, 0]"
      ></ngt-hemisphere-light>
      <ngt-directional-light
        [args]="['#ffffff']"
        [position]="[0, 20, 10]"
        [castShadow]="true"
      ></ngt-directional-light>

      <!--    ground-->
      <ngt-soba-plane
        [args]="[2000, 2000]"
        [rotation]="[-(0.5 | mathConst: 'PI'), 0, 0]"
        [receiveShadow]="true"
      >
        <ngt-mesh-phong-material
          [parameters]="{ color: '#ffffff', depthWrite: false }"
        ></ngt-mesh-phong-material>
      </ngt-soba-plane>
      <ngt-grid-helper
        #ngtGridHelper="ngtGridHelper"
        (ready)="onGridHelperReady(ngtGridHelper.helper)"
        [args]="[200, 40, '#000000', '#000000']"
        [receiveShadow]="true"
      ></ngt-grid-helper>

      <!--      robot-->
      <ngt-robot></ngt-robot>
    </ngt-canvas>
    <ngt-soba-loader></ngt-soba-loader>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RobotExpressiveComponent {
  onGridHelperReady(helper: GridHelper) {
    const material = helper.material as Material;
    material.opacity = 0.2;
    material.transparent = true;
  }
}

@NgModule({
  declarations: [RobotExpressiveComponent, RobotComponent, RobotGuiComponent],
  exports: [RobotExpressiveComponent],
  imports: [
    NgtCoreModule,
    NgtHemisphereLightModule,
    NgtDirectionalLightModule,
    NgtSobaPlaneModule,
    NgtMeshPhongMaterialModule,
    NgtGridHelperModule,
    CommonModule,
    NgtSobaLoaderModule,
    NgtPrimitiveModule,
    NgtStatsModule,
    NgxLilGuiModule,
    NgtColorPipeModule,
    NgtFogPipeModule,
    NgtMathPipeModule,
  ],
})
export class RobotExpressiveModule {}
