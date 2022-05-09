import { NgtCanvasModule, NgtEuler, NgtVector3 } from '@angular-three/core';
import { NgtValueAttributeModule } from '@angular-three/core/attributes';
import { NgtPointLightModule, NgtSpotLightModule } from '@angular-three/core/lights';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { NgtGLTFLoader, NgtSobaLoaderModule } from '@angular-three/soba/loaders';
import { NgtSobaDetailedModule } from '@angular-three/soba/performances';
import { NgtSobaEnvironmentModule } from '@angular-three/soba/staging';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import * as THREE from 'three';
import { GLTF } from 'three-stdlib';

const positions = [...Array(800)].map(() => ({
  position: [40 - Math.random() * 80, 40 - Math.random() * 80, 40 - Math.random() * 80],
  rotation: [Math.random() * Math.PI * 2, Math.random() * Math.PI * 2, Math.random() * Math.PI * 2],
})) as Array<{ position: NgtVector3; rotation: NgtEuler }>;

@Component({
  selector: 'sandbox-level-of-detail',
  template: `
    <ngt-canvas
      shadows
      frameloop="demand"
      [dpr]="[1, 2]"
      [camera]="{ position: [0, 0, 40] }"
      (created)="$event.gl.shadowMap.autoUpdate = false; $event.gl.shadowMap.needsUpdate = true"
    >
      <sandbox-scene></sandbox-scene>
    </ngt-canvas>
    <ngt-soba-loader></ngt-soba-loader>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelOfDetailComponent {}

@Component({
  selector: 'sandbox-scene',
  template: `
    <sandbox-bust
      *ngFor="let position of positions"
      [position]="position.position"
      [rotation]="position.rotation"
    ></sandbox-bust>

    <ngt-soba-orbit-controls zoomSpeed="0.075"></ngt-soba-orbit-controls>
    <ngt-point-light [position]="[0, 0, 0]" intensity="0.5"></ngt-point-light>
    <ngt-spot-light intensity="2.5" [position]="[50, 50, 50]" castShadow></ngt-spot-light>
    <ngt-soba-environment preset="city"></ngt-soba-environment>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Scene {
  readonly positions = positions;
}

interface BustGLTF extends GLTF {
  nodes: {
    Mesh_0001: THREE.Mesh;
  };
  materials: {
    default: THREE.MeshStandardMaterial;
  };
}

@Component({
  selector: 'sandbox-bust',
  template: `
    <ngt-soba-detailed [distances]="[15, 25, 35, 100]" [position]="position" [rotation]="rotation">
      <ng-template ngt-soba-detailed-content>
        <ngt-mesh
          *ngFor="let level of levels$ | async"
          receiveShadow
          castShadow
          [geometry]="level.nodes.Mesh_0001.geometry"
          [material]="level.materials.default"
        >
          <ngt-value [attach]="['material', 'envMapIntensity']" [value]="0.25"></ngt-value>
        </ngt-mesh>
      </ng-template>
    </ngt-soba-detailed>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Bust {
  @Input() position?: NgtVector3;
  @Input() rotation?: NgtEuler;

  readonly levels$ = this.gltfLoader.load([
    'assets/bust-1-d.glb',
    'assets/bust-2-d.glb',
    'assets/bust-3-d.glb',
    'assets/bust-4-d.glb',
  ]) as Observable<BustGLTF[]>;

  constructor(private gltfLoader: NgtGLTFLoader) {}
}

@NgModule({
  declarations: [LevelOfDetailComponent, Scene, Bust],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: LevelOfDetailComponent,
      },
    ]),
    NgtSobaDetailedModule,
    NgtMeshModule,
    NgtValueAttributeModule,
    NgtCanvasModule,
    NgtSobaLoaderModule,
    NgtSobaOrbitControlsModule,
    NgtPointLightModule,
    NgtSpotLightModule,
    NgtSobaEnvironmentModule,
  ],
})
export class LevelOfDetailComponentModule {}
