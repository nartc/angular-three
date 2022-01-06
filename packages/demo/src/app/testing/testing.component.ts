import {
  NgtColorPipeModule,
  NgtCoreModule,
  NgtCreatedState,
} from '@angular-three/core';
import {
  NgtAmbientLightModule,
  NgtPointLightModule,
} from '@angular-three/core/lights';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtSobaBoxModule } from '@angular-three/soba/shapes';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { VRButton } from 'three-stdlib';

@Component({
  selector: 'ngt-testing',
  template: `
    <ngt-canvas
      vr
      [shadows]="true"
      [camera]="{ position: [-5, 5, 5], fov: 75 }"
      [scene]="{ background: 'black' | color }"
      (created)="onCreated($event)"
    >
      <ngt-ambient-light [intensity]="0.8"></ngt-ambient-light>
      <ngt-point-light [intensity]="1" [position]="[0, 6, 0]"></ngt-point-light>

      <ngt-soba-box>
        <ngt-mesh-basic-material
          [parameters]="{ wireframe: true }"
        ></ngt-mesh-basic-material>
      </ngt-soba-box>

      <ngt-soba-orbit-controls></ngt-soba-orbit-controls>

      <ngt-stats></ngt-stats>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestingComponent {
  onCreated($event: NgtCreatedState) {
    document.body.appendChild(VRButton.createButton($event.renderer));
  }
}

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
    NgtMeshBasicMaterialModule,
    NgtSobaBoxModule,
  ],
})
export class TestingComponentModule {}
