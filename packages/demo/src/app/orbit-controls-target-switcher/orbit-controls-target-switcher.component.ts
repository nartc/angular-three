import {
  makeVector3,
  NGT_CANVAS_OPTIONS,
  NgtCoreModule,
  NgtCursorModule,
  NgtMathPipeModule,
  provideCanvasOptions,
} from '@angular-three/core';
import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtGridHelperModule } from '@angular-three/core/helpers';
import {
  NgtAmbientLightModule,
  NgtSpotLightModule,
} from '@angular-three/core/lights';
import {
  NgtMeshPhongMaterialModule,
  NgtMeshStandardMaterialModule,
} from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaTextModule } from '@angular-three/soba/abstractions';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  NgModule,
  NgZone,
} from '@angular/core';
import { gsap } from 'gsap';

// @ts-ignore
import niceColors from 'nice-color-palettes';
import { Mesh, Vector3 } from 'three';
import { OrbitControls } from 'three-stdlib';
import { environment } from '../../environments/environment';
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
    <ngt-canvas>
      <ngt-stats></ngt-stats>

      <ngt-ambient-light></ngt-ambient-light>
      <ngt-spot-light [position]="[1, 10, 1]"></ngt-spot-light>

      <ngt-group [position]="[0, 2, 0]">
        <ngt-group
          *ngFor="let cubeContent of cubeContents; let i = index"
          [rotation]="[0, ((2 | mathConst: 'PI') / cubeContents.length) * i, 0]"
        >
          <ngt-soba-text
            [position]="[6, 1, 0]"
            [fontSize]="1"
            [color]="cubeContent.color"
          >
            {{ cubeContent.label }}
          </ngt-soba-text>
          <ngt-mesh
            ngtCursor
            #cube="ngtMesh"
            (ready)="cubes.push(cube.mesh)"
            (click)="onCubeSelected(cubeContent, i)"
            [position]="[6, 0, 0]"
            [userData]="cubeContent"
          >
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-standard-material
              [parameters]="{ color: cubeContent.color }"
            ></ngt-mesh-standard-material>
          </ngt-mesh>
        </ngt-group>
      </ngt-group>

      <ngt-grid-helper
        [args]="[200, 40, '#ED6307', '#8E8E8E']"
      ></ngt-grid-helper>

      <ngt-soba-orbit-controls
        (ready)="orbitControls = $event"
        [target]="[0, 2, 0]"
      ></ngt-soba-orbit-controls>
    </ngt-canvas>

    <nav>
      <div>
        <span
          (click)="onCubeSelected(null, -1)"
          [class.active]="selectedCube === null"
        >
          start
        </span>
        <span
          *ngFor="let cubeContent of cubeContents; index as i"
          (click)="onCubeSelected(cubeContent, i)"
          [class.active]="cubeContent.id === selectedCube?.id"
        >
          {{ cubeContent.label }}
        </span>
      </div>
      <small>
        select a cube or a menu item to update Orbit Controls Target
      </small>
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
  providers: [
    {
      provide: NGT_CANVAS_OPTIONS,
      useValue: provideCanvasOptions({
        projectContent: !environment.production,
      }),
    },
  ],
})
export class OrbitControlsTargetSwitcherComponent {
  cubeContents: CubeContent[] = [
    {
      id: 0,
      label: 'TRGT1',
      color: this.#getRandomColor()[0],
    },
    {
      id: 1,
      label: 'TRGT2',
      color: this.#getRandomColor()[1],
    },
    {
      id: 2,
      label: 'TRGT3',
      color: this.#getRandomColor()[2],
    },
    {
      id: 3,
      label: 'TRGT4',
      color: this.#getRandomColor()[3],
    },
    {
      id: 4,
      label: 'TRGT5',
      color: this.#getRandomColor()[4],
    },
  ];

  cubes: Mesh[] = [];
  orbitControls!: OrbitControls;

  #selectedCube: CubeContent | null = null;

  get selectedCube(): CubeContent | null {
    return this.#selectedCube;
  }

  constructor(private ngZone: NgZone) {}

  onCubeSelected(cubeContent: CubeContent | null, index: number) {
    this.#selectedCube = cubeContent;
    const orbitControlsTarget = makeVector3(this.orbitControls.target);
    if (!cubeContent) {
      this.#tweenOrbitControls(orbitControlsTarget!, new Vector3(0, 2, 0));
      return;
    }
    const mesh = this.cubes[index];
    if (mesh) {
      const target: Vector3 = new Vector3();
      mesh.getWorldPosition(target);
      this.#tweenOrbitControls(orbitControlsTarget!, target);
    }
  }

  #tweenOrbitControls(source: Vector3, target: Vector3) {
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

  #getRandomColor() {
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
    NgtBoxGeometryModule,
    NgtMeshModule,
    NgtMeshStandardMaterialModule,
    CommonModule,
    NgtMeshPhongMaterialModule,
    NgtGridHelperModule,
    NgtSobaTextModule,
    NgtCursorModule,
    NgtMathPipeModule,
  ],
})
export class OrbitControlsTargetSwitcherComponentModule {}
