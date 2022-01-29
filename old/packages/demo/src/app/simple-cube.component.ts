import { NgtColorPipeModule, NgtCoreModule } from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import {
  NgtBoxHelperModule,
  NgtSpotLightHelperModule,
} from '@angular-three/core/helpers';
import {
  NgtAmbientLightModule,
  NgtSpotLightModule,
} from '@angular-three/core/lights';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import {
  NgtSobaGizmoHelperModule,
  NgtSobaGizmoViewportModule,
} from '@angular-three/soba/abstractions';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtSobaBoxModule } from '@angular-three/soba/shapes';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxLilGuiControllerNumberConfig, NgxLilGuiModule } from 'ngx-lil-gui';
import * as THREE from 'three';

@Component({
  selector: 'ngt-simple-cube',
  template: `
    <ngt-canvas [camera]="{ position: [0, 2, 5] }">
      <ngt-stats></ngt-stats>

      <ngt-lights></ngt-lights>
      <ngt-cube [x]="scale[0]" [y]="scale[1]" [z]="scale[2]"></ngt-cube>

      <ngt-soba-gizmo-helper>
        <ngt-soba-gizmo-viewport
          [axisColors]="['red', 'green', 'blue']"
          labelColor="black"
          [hideNegativeAxes]="false"
        ></ngt-soba-gizmo-viewport>
      </ngt-soba-gizmo-helper>

      <ngt-soba-orbit-controls></ngt-soba-orbit-controls>
    </ngt-canvas>

    <div class="controls">
      <label>
        <input
          type="range"
          [(ngModel)]="scale[0]"
          [min]="0.1"
          [max]="3"
          [step]="0.1"
        />
        x
      </label>
      <label>
        <input
          type="range"
          [(ngModel)]="scale[1]"
          [min]="0.1"
          [max]="3"
          [step]="0.1"
        />
        y
      </label>
      <label>
        <input
          type="range"
          [(ngModel)]="scale[2]"
          [min]="0.1"
          [max]="3"
          [step]="0.1"
        />
        z
      </label>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .controls {
        position: absolute;
        bottom: 0;
        left: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    `,
  ],
})
export class SimpleCubeComponent {
  scale = [1, 1, 1];
}

@Component({
  selector: 'ngt-lights',
  template: `
    <ngt-ambient-light></ngt-ambient-light>
    <ngt-spot-light
      #spotLight="ngtSpotLight"
      [ngtSpotLightHelper]="['black']"
      [position]="[1, 1, 1]"
    ></ngt-spot-light>

    <ngx-lil-gui
      title="SpotLight Position"
      [object]="spotLight.light.position"
      [container]="false"
      [zoneless]="true"
    >
      <ngx-lil-gui-controller
        property="x"
        [controllerConfig]="positionControllerConfig"
      ></ngx-lil-gui-controller>
      <ngx-lil-gui-controller
        property="y"
        [controllerConfig]="positionControllerConfig"
      ></ngx-lil-gui-controller>
      <ngx-lil-gui-controller
        property="z"
        [controllerConfig]="positionControllerConfig"
      ></ngx-lil-gui-controller>
    </ngx-lil-gui>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LightsComponent {
  positionControllerConfig: NgxLilGuiControllerNumberConfig = {
    min: 1,
    max: 10,
    step: 0.01,
  };
}

@Component({
  selector: 'ngt-cube',
  template: `
    <ngt-soba-box
      #sobaBox
      [ngtBoxHelper]="['black']"
      (animateReady)="onAnimateReady(sobaBox.object)"
      (pointerover)="hover = true"
      (pointerout)="hover = false"
      [isMaterialArray]="true"
      [scale]="[x, y, z]"
    >
      <ngt-cube-materials [hover]="hover"></ngt-cube-materials>
    </ngt-soba-box>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeComponent {
  @Input() x = 1;
  @Input() y = 1;
  @Input() z = 1;
  hover = false;

  onAnimateReady(mesh: THREE.Mesh) {
    mesh.rotation.y += 0.01;
  }
}

@Component({
  selector: 'ngt-cube-materials',
  template: `
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'turquoise' : 'tomato' }"
    ></ngt-mesh-standard-material>
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'hotpink' : 'orange' }"
    ></ngt-mesh-standard-material>
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'blue' : 'red' }"
    ></ngt-mesh-standard-material>
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'green' : 'yellow' }"
    ></ngt-mesh-standard-material>
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'purple' : 'brown' }"
    ></ngt-mesh-standard-material>
    <ngt-mesh-standard-material
      [parameters]="{ color: hover ? 'tomato' : 'turquoise' }"
    ></ngt-mesh-standard-material>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CubeMaterials {
  @Input() hover = false;
}

@NgModule({
  declarations: [
    SimpleCubeComponent,
    CubeComponent,
    CubeMaterials,
    LightsComponent,
  ],
  exports: [SimpleCubeComponent],
  imports: [
    NgtCoreModule,
    NgtStatsModule,
    NgtAmbientLightModule,
    NgtSpotLightModule,
    NgtMeshModule,
    NgtMeshStandardMaterialModule,
    NgtBoxGeometryModule,
    NgtSobaOrbitControlsModule,
    NgtSobaBoxModule,
    NgtBoxHelperModule,
    NgtSpotLightHelperModule,
    NgtColorPipeModule,
    NgtSobaGizmoHelperModule,
    NgtSobaGizmoViewportModule,
    FormsModule,
    NgxLilGuiModule,
  ],
})
export class SimpleCubeComponentModule {}
