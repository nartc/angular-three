import { NgtCoreModule, provideCanvasOptions } from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtBoxHelperModule } from '@angular-three/core/helpers';
import {
  NgtAmbientLightModule,
  NgtSpotLightModule,
} from '@angular-three/core/lights';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import { Object3D } from 'three';

@Component({
  selector: 'demo-simple-cube',
  template: `
    <ngt-canvas>
      <ngt-ambient-light></ngt-ambient-light>
      <ngt-spot-light [position]="[5, 5, 5]"></ngt-spot-light>

      <ngt-mesh
        [ngtBoxHelper]="['black']"
        (animateReady)="onCubeAnimate($event.object)"
        (click)="active = !active"
        (pointerover)="hover = true"
        (pointerout)="hover = false"
        [scale]="active ? [1.5, 1.5, 1.5] : [1, 1, 1]"
      >
        <ngt-box-geometry></ngt-box-geometry>
        <ngt-mesh-standard-material
          [parameters]="{ color: hover ? 'hotpink' : 'orange' }"
        ></ngt-mesh-standard-material>
      </ngt-mesh>

      <ngt-soba-orbit-controls></ngt-soba-orbit-controls>

      <ngt-stats></ngt-stats>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCanvasOptions({ initialLog: true })],
})
export class SimpleCubeComponent {
  hover = false;
  active = false;

  onCubeAnimate(cube: Object3D) {
    cube.rotation.x = cube.rotation.y += 0.01;
  }
}

@NgModule({
  declarations: [SimpleCubeComponent],
  exports: [SimpleCubeComponent],
  imports: [
    NgtCoreModule,
    NgtBoxGeometryModule,
    NgtMeshStandardMaterialModule,
    NgtAmbientLightModule,
    NgtSpotLightModule,
    NgtBoxHelperModule,
    NgtStatsModule,
    NgtMeshModule,
    NgtSobaOrbitControlsModule,
  ],
})
export class SimpleCubeComponentModule {}
