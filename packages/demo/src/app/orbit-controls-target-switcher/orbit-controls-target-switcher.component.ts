import { makeVector3, NgtCoreModule } from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import {
  NgtGridHelperModule,
  NgtPolarGridHelperModule,
  NgtSpotLightHelperModule,
} from '@angular-three/core/helpers';
import {
  NgtAmbientLightModule,
  NgtSpotLightModule,
} from '@angular-three/core/lights';
import {
  NgtMeshPhongMaterialModule,
  NgtMeshStandardMaterialModule,
} from '@angular-three/core/materials';
import { NgtMesh, NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import {
  NgtSobaOrbitControls,
  NgtSobaOrbitControlsModule,
} from '@angular-three/soba/controls';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  NgZone,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { gsap } from 'gsap';

// @ts-ignore
import niceColors from 'nice-color-palettes';
import { Vector3 } from 'three';
import { SimpleCubeComponentModule } from '../simple-cube.component';

export interface CubeContent {
  [property: string]: any;

  id: number;
  label: string;
  color: string;
}

@Component({
  selector: 'ngt-orbit-controls-target-switcher',
  template: `
    <ngt-canvas [scene]="{ background: 'white' | color }">
      <ngt-stats></ngt-stats>
      <ngt-ambient-light></ngt-ambient-light>

      <ngt-spot-light [position]="[1, 10, 1]"></ngt-spot-light>

      <ngt-group [position]="[0, 2, 0]">
        <ng-template
          ngFor
          [ngForOf]="cubeContents"
          let-cubeContent
          let-i="index"
        >
          <ngt-group
            [rotation]="[
              0,
              ((2 | mathConst: 'PI') / cubeContents.length) * i,
              0
            ]"
          >
            <ngt-mesh
              #cube
              [position]="[6, 0, 0]"
              (click)="selectedCube = cubeContent"
              [userData]="cubeContent"
            >
              <ngt-box-geometry [args]="[1, 1, 1]"></ngt-box-geometry>
              <ngt-mesh-standard-material
                [parameters]="{ color: cubeContent.color }"
              ></ngt-mesh-standard-material>
            </ngt-mesh>
          </ngt-group>
        </ng-template>
      </ngt-group>

      <ngt-grid-helper
        [args]="[200, 40, '#ED6307', '#8E8E8E']"
        [receiveShadow]="true"
      ></ngt-grid-helper>

      <ngt-soba-orbit-controls
        #orbitControls
        [target]="[0, 2, 0]"
      ></ngt-soba-orbit-controls>
    </ngt-canvas>

    <nav>
      <div>
        <span
          (click)="selectedCube = null"
          [innerHTML]="'start'"
          [class.active]="selectedCube === null"
        ></span>
        <ng-template
          ngFor
          [ngForOf]="cubeContents"
          let-cubeContent
          let-i="index"
        >
          <span
            (click)="selectedCube = cubeContent"
            [innerHTML]="cubeContent.label"
            [class.active]="cubeContent.id === selectedCube?.id"
          ></span>
        </ng-template>
      </div>
      <small
        >select a cube or a menu item to update Orbit Controls Target</small
      >
    </nav>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        font-family: sans-serif;
      }

      :host nav {
        position: absolute;
        top: 0;
        width: 100%;
        padding: 1em 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        user-select: none;
      }

      :host nav > div {
        display: flex;
        justify-content: center;
        align-items: center;
        text-transform: uppercase;
        gap: 1em;
      }

      :host nav > small {
        opacity: 0.7;
      }

      :host nav > div span {
        cursor: pointer;
      }

      :host nav > div span.active {
        font-weight: bold;
        font-size: 2em;
        cursor: auto;
      }
    `,
  ],
})
export class OrbitControlsTargetSwitcherComponent implements OnInit {
  cubeContents: CubeContent[] = [
    {
      id: 0,
      label: 'TRGT1',
      color: this.getRandomColor()[0],
    },
    {
      id: 1,
      label: 'TRGT2',
      color: this.getRandomColor()[1],
    },
    {
      id: 2,
      label: 'TRGT3',
      color: this.getRandomColor()[2],
    },
    {
      id: 3,
      label: 'TRGT4',
      color: this.getRandomColor()[3],
    },
    {
      id: 4,
      label: 'TRGT5',
      color: this.getRandomColor()[4],
    },
  ];

  @ViewChild('orbitControls', { read: NgtSobaOrbitControls })
  orbitControls!: NgtSobaOrbitControls;

  @ViewChildren('cube', { read: NgtMesh }) cubeMeshes!: QueryList<NgtMesh>;

  #selectedCube: CubeContent | null = null;

  set selectedCube(value: CubeContent | null) {
    this.#selectedCube = value;
    if (this.cubeMeshes) {
      const cubeContentIndex = this.cubeContents.findIndex((cubeContent) => {
        return value?.id === cubeContent.id;
      });
      const orbitControlsTarget = makeVector3(
        this.orbitControls.controls.target
      );
      if (orbitControlsTarget) {
        if (cubeContentIndex > -1) {
          const target: Vector3 = new Vector3();
          const cubeMesh = this.cubeMeshes.get(cubeContentIndex);
          if (cubeMesh) {
            cubeMesh.mesh.getWorldPosition(target);
            this.tweenOrbitControls(orbitControlsTarget, target);
          }
        } else {
          this.tweenOrbitControls(orbitControlsTarget, new Vector3(0, 2, 0));
        }
      }
    }
  }

  get selectedCube(): CubeContent | null {
    return this.#selectedCube;
  }

  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  tweenOrbitControls(source: Vector3, target: Vector3) {
    this.ngZone.runOutsideAngular(() => {
      gsap.to(source, {
        duration: 1,
        x: target.x,
        y: target.y,
        z: target.z,
        //onUpdate fires each time the tween updates; we'll explain callbacks later.
        onUpdate: () => {
          this.orbitControls.target = source;
        },
      });
    });
  }

  getRandomColor(): any {
    return niceColors[Math.floor(Math.random() * niceColors.length)];
  }
}

@NgModule({
  declarations: [OrbitControlsTargetSwitcherComponent],
  exports: [OrbitControlsTargetSwitcherComponent],
  imports: [
    NgtCoreModule,
    NgtGroupModule,
    NgtStatsModule,
    NgtAmbientLightModule,
    SimpleCubeComponentModule,
    NgtSobaOrbitControlsModule,
    NgtSpotLightModule,
    NgtSpotLightHelperModule,
    NgtBoxGeometryModule,
    NgtMeshModule,
    NgtMeshStandardMaterialModule,
    CommonModule,
    NgtMeshPhongMaterialModule,
    NgtPolarGridHelperModule,
    NgtGridHelperModule,
  ],
})
export class OrbitControlsTargetSwitcherComponentModule {}
