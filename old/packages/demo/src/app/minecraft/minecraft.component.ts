import {
  NgtColorPipeModule,
  NgtCoreModule,
  NgtCreatedState,
  NgtMathPipeModule,
  NgtSidePipeModule,
} from '@angular-three/core';
import { NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import {
  NgtAmbientLightModule,
  NgtDirectionalLightModule,
} from '@angular-three/core/lights';
import { NgtMeshLambertMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaFirstPersonControlsModule } from '@angular-three/soba/controls';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { WorldComponent, WorldGeometryComponent } from './world.component';
import { getY, worldHalfDepth, worldHalfWidth } from './world.utils';

@Component({
  selector: 'ngt-minecraft',
  template: `
    <ngt-canvas
      (created)="onCanvasCreated($event)"
      [camera]="{ fov: 60, near: 1, far: 20000 }"
      [scene]="{ background: '#bfd1e5' | color }"
    >
      <ngt-ambient-light color="#cccccc"></ngt-ambient-light>
      <ngt-directional-light
        [args]="['#ffffff', 2]"
        (ready)="$event.position.set(1, 1, 0.5).normalize()"
      ></ngt-directional-light>

      <ngt-world></ngt-world>

      <ngt-soba-first-person-controls
        (ready)="
          $event.movementSpeed = 1000;
          $event.lookSpeed = 0.125;
          $event.lookVertical = true
        "
      ></ngt-soba-first-person-controls>

      <ngt-stats></ngt-stats>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinecraftComponent {
  onCanvasCreated({ camera }: NgtCreatedState) {
    camera.position.y = getY(worldHalfWidth, worldHalfDepth) * 100 + 100;
  }
}

@NgModule({
  declarations: [MinecraftComponent, WorldComponent, WorldGeometryComponent],
  exports: [MinecraftComponent],
  imports: [
    CommonModule,
    NgtCoreModule,
    NgtColorPipeModule,
    NgtPlaneGeometryModule,
    NgtMathPipeModule,
    NgtMeshModule,
    NgtMeshLambertMaterialModule,
    NgtAmbientLightModule,
    NgtDirectionalLightModule,
    NgtSobaFirstPersonControlsModule,
    NgtStatsModule,
    NgtSidePipeModule,
  ],
})
export class MinecraftComponentModule {}
