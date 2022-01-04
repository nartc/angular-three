import { NgtColorPipeModule, NgtCoreModule } from '@angular-three/core';
import {
  NgtAmbientLightModule,
  NgtPointLightModule,
} from '@angular-three/core/lights';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtStatsModule } from '@angular-three/core/stats';
import {
  NgtSobaOrbitControlsModule,
  NgtSobaTransformControlsModule,
} from '@angular-three/soba/controls';
import { NgtSobaBoxModule } from '@angular-three/soba/shapes';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';

@Component({
  selector: 'ngt-testing',
  template: `
    <ngt-canvas
      [shadows]="true"
      [camera]="{ position: [-5, 5, 5], fov: 75 }"
      [scene]="{ background: 'black' | color }"
    >
      <ngt-ambient-light [intensity]="0.8"></ngt-ambient-light>
      <ngt-point-light [intensity]="1" [position]="[0, 6, 0]"></ngt-point-light>

      <ngt-soba-transform-controls>
        <ngt-soba-box>
          <ngt-mesh-basic-material
            [parameters]="{ wireframe: true }"
          ></ngt-mesh-basic-material>
        </ngt-soba-box>
      </ngt-soba-transform-controls>

      <ngt-soba-orbit-controls [makeDefault]="true"></ngt-soba-orbit-controls>

      <ngt-stats></ngt-stats>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestingComponent {}

@NgModule({
  declarations: [TestingComponent],
  exports: [TestingComponent],
  imports: [
    NgtCoreModule,
    NgtColorPipeModule,
    NgtStatsModule,
    NgtAmbientLightModule,
    NgtPointLightModule,
    NgtSobaOrbitControlsModule,
    NgtSobaTransformControlsModule,
    NgtMeshBasicMaterialModule,
    NgtSobaBoxModule,
  ],
})
export class TestingComponentModule {}
