import { NgtCoreModule } from '@angular-three/core';
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
import { GridHelper, Material } from 'three';
import { RobotComponent } from './robot.component';

@Component({
  selector: 'ngt-robot-expressive',
  templateUrl: './robot-expressive.component.html',
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
  declarations: [RobotExpressiveComponent, RobotComponent],
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
  ],
})
export class RobotExpressiveModule {}
