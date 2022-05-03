import { NgtPhysicBody, NgtPhysicsModule } from '@angular-three/cannon';
import {
  coerceNumberProperty,
  NgtCanvasModule,
  NgtComponentStore,
  NgtRadianPipeModule,
  NgtTriple,
  NumberInput,
  provideCommonGeometryRef,
  Ref,
} from '@angular-three/core';
import { NgtColorAttributeModule, NgtInstancedBufferAttributeModule } from '@angular-three/core/attributes';
import { NgtBufferGeometry, NgtBufferGeometryModule, NgtSphereGeometryModule } from '@angular-three/core/geometries';
import { NgtAmbientLightModule, NgtDirectionalLightModule } from '@angular-three/core/lights';
import { NgtMeshPhongMaterialModule } from '@angular-three/core/materials';
import { NgtInstancedMeshModule, NgtMeshModule } from '@angular-three/core/meshes';
import { NgtStatsModule } from '@angular-three/core/stats';
import { NgtSobaOrbitControlsModule } from '@angular-three/soba/controls';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import { tap } from 'rxjs';
import * as THREE from 'three';

type GenerateHeightmapArgs = {
  height: number;
  number: number;
  scale: number;
  width: number;
};

/* Generates a 2D array using Worley noise. */
function generateHeightmap({ width, height, number, scale }: GenerateHeightmapArgs) {
  const data = [];

  const seedPoints = [];
  for (let i = 0; i < number; i++) {
    seedPoints.push([Math.random(), Math.random()]);
  }

  let max = 0;
  for (let i = 0; i < width; i++) {
    const row = [];
    for (let j = 0; j < height; j++) {
      let min = Infinity;
      seedPoints.forEach((p) => {
        const distance2 = (p[0] - i / width) ** 2 + (p[1] - j / height) ** 2;
        if (distance2 < min) {
          min = distance2;
        }
      });
      const d = Math.sqrt(min);
      if (d > max) {
        max = d;
      }
      row.push(d);
    }
    data.push(row);
  }

  /* Normalize and scale. */
  for (let i = 0; i < width; i++) {
    for (let j = 0; j < height; j++) {
      data[i][j] *= scale / max;
    }
  }
  return data;
}

@Component({
  selector: 'sandbox-height-field-example',
  template: `
    <ngt-canvas shadows [camera]="{ position: [0, -10, 10] }">
      <ngt-color attach="background" color="#171720"></ngt-color>

      <ngt-soba-orbit-controls
        enableDamping
        dampingFactor="0.2"
        [minPolarAngle]="60 | radian"
        [maxPolarAngle]="60 | radian"
      ></ngt-soba-orbit-controls>

      <ngt-physics>
        <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
        <ngt-directional-light [position]="[0, 3, 0]" castShadow></ngt-directional-light>

        <sandbox-height-field
          [elementSize]="scale / 128"
          [heights]="heights"
          [position]="[-scale / 2, 0, scale / 2]"
          [rotation]="[-90 | radian, 0, 0]"
        ></sandbox-height-field>

        <sandbox-spheres rows="3" columns="3" [spread]="4"></sandbox-spheres>
      </ngt-physics>

      <ngt-stats></ngt-stats>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeightFieldExampleComponent {
  @Input() scale = 10;

  heights = generateHeightmap({
    height: 128,
    number: 10,
    scale: 1,
    width: 128,
  });
}

@Component({
  selector: 'sandbox-height-field-geometry[elementSize][heights]',
  template: `<ngt-buffer-geometry [ref]="geometryRef"></ngt-buffer-geometry>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(HeightFieldGeometryComponent, (geometry) => geometry.geometryRef)],
})
export class HeightFieldGeometryComponent extends NgtBufferGeometry {
  @Input() elementSize = 0;
  @Input() set heights(heights: number[][]) {
    this.set({ heights });
  }

  readonly geometryRef = new Ref<THREE.BufferGeometry>();

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.effect<{}>(
          tap(() => {
            if (!this.geometryRef.value) return;
            const heights = this.get((s) => s['heights']) as number[][];

            const dx = this.elementSize;
            const dy = this.elementSize;

            /* Create the vertex data from the heights. */
            const vertices = heights.flatMap((row, i) => row.flatMap((z, j) => [i * dx, j * dy, z]));

            /* Create the faces. */
            const indices = [];
            for (let i = 0; i < heights.length - 1; i++) {
              for (let j = 0; j < heights[i].length - 1; j++) {
                const stride = heights[i].length;
                const index = i * stride + j;
                indices.push(index + 1, index + stride, index + stride + 1);
                indices.push(index + stride, index + 1, index);
              }
            }

            this.geometryRef.value.setIndex(indices);
            this.geometryRef.value.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            this.geometryRef.value.computeVertexNormals();
            this.geometryRef.value.computeBoundingBox();
            this.geometryRef.value.computeBoundingSphere();
          })
        )(
          this.select(
            this.geometryRef,
            this.select((s) => s['heights'])
          )
        );
      });
    });
  }
}

@Component({
  selector: 'sandbox-height-field[elementSize][heights][position][rotation]',
  template: `
    <ngt-mesh [ref]="heightFieldRef.ref" castShadow receiveShadow>
      <ngt-mesh-phong-material [color]="color"></ngt-mesh-phong-material>
      <sandbox-height-field-geometry [elementSize]="elementSize" [heights]="heights"></sandbox-height-field-geometry>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
})
export class HeightFieldComponent {
  @Input() elementSize = 0;
  @Input() heights: number[][] = [];
  @Input() position: NgtTriple = [0, 0, 0];
  @Input() rotation: NgtTriple = [0, 0, 0];

  readonly color = niceColors[17][4];

  heightFieldRef = this.physicBody.useHeightfield(() => ({
    args: [
      this.heights,
      {
        elementSize: this.elementSize,
      },
    ],
    position: this.position,
    rotation: this.rotation,
  }));

  constructor(private physicBody: NgtPhysicBody) {}
}

@Component({
  selector: 'sandbox-spheres[columns][rows][spread]',
  template: `
    <ng-container *ngIf="viewModel$ | async as viewModel">
      <ngt-instanced-mesh [count]="viewModel.number" [ref]="sphereRef.ref" castShadow receiveShadow>
        <ngt-sphere-geometry [args]="[0.2, 16, 16]">
          <ngt-instanced-buffer-attribute
            [attach]="['attributes', 'color']"
            [args]="[viewModel.colors, 3]"
          ></ngt-instanced-buffer-attribute>
        </ngt-sphere-geometry>
        <ngt-mesh-phong-material vertexColors></ngt-mesh-phong-material>
      </ngt-instanced-mesh>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [NgtPhysicBody],
})
export class SpheresComponent extends NgtComponentStore {
  @Input() set columns(columns: NumberInput) {
    this.set({ columns: coerceNumberProperty(columns) });
  }

  @Input() set rows(rows: NumberInput) {
    this.set({ rows: coerceNumberProperty(rows) });
  }

  @Input() spread = 0;

  sphereRef = this.physicBody.useSphere((index) => ({
    args: [0.2],
    mass: 1,
    position: [
      ((index % this.get((s) => s['columns'])) - (this.get((s) => s['columns']) - 1) / 2) * this.spread,
      2.0,
      (Math.floor(index / this.get((s) => s['columns'])) - (this.get((s) => s['rows']) - 1) / 2) * this.spread,
    ],
  }));

  readonly viewModel$ = this.select(
    this.select((s) => s['columns']),
    this.select((s) => s['rows']),
    (columns, rows) => {
      const number = columns * rows;
      const array = new Float32Array(number * 3);
      const color = new THREE.Color();
      for (let i = 0; i < number; i++) {
        color
          .set(niceColors[17][Math.floor(Math.random() * 5)])
          .convertSRGBToLinear()
          .toArray(array, i * 3);
      }
      return { colors: array, number };
    }
  );

  constructor(private physicBody: NgtPhysicBody) {
    super();
  }
}

@NgModule({
  declarations: [HeightFieldExampleComponent, HeightFieldGeometryComponent, HeightFieldComponent, SpheresComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: HeightFieldExampleComponent,
      },
    ]),
    NgtStatsModule,
    NgtBufferGeometryModule,
    NgtMeshModule,
    NgtMeshPhongMaterialModule,
    NgtInstancedMeshModule,
    NgtSphereGeometryModule,
    NgtInstancedBufferAttributeModule,
    NgtCanvasModule,
    NgtColorAttributeModule,
    NgtSobaOrbitControlsModule,
    NgtRadianPipeModule,
    NgtPhysicsModule,
    NgtAmbientLightModule,
    NgtDirectionalLightModule,
  ],
})
export class HeightFieldExampleComponentModule {}
