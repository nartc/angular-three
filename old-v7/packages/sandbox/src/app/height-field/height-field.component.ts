import { NgtPhysics } from '@angular-three/cannon';
import { NgtPhysicsBody } from '@angular-three/cannon/services';
import { NgtCanvas, NgtRadianPipe, provideCommonGeometryRef, provideNgtCommonGeometry } from '@angular-three/core';
import { NgtColorAttribute, NgtInstancedBufferAttribute } from '@angular-three/core/attributes';
import { NgtBufferGeometry, NgtSphereGeometry } from '@angular-three/core/geometries';
import { NgtAmbientLight, NgtDirectionalLight } from '@angular-three/core/lights';
import { NgtMeshPhongMaterial } from '@angular-three/core/materials';
import { NgtInstancedMesh, NgtMesh } from '@angular-three/core/objects';
import { NgtStats } from '@angular-three/core/stats';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { ChangeDetectionStrategy, Component, inject, Input, OnInit } from '@angular/core';
import { Triplet } from '@pmndrs/cannon-worker-api';
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
  selector: 'spheres[columns][rows][spread]',
  standalone: true,
  template: `
    <ngt-instanced-mesh [count]="number" [ref]="sphereBody.ref" castShadow receiveShadow>
      <ngt-sphere-geometry [args]="[0.2, 16, 16]">
        <ngt-instanced-buffer-attribute
          [attach]="['attributes', 'color']"
          [args]="[colors, 3]"
        ></ngt-instanced-buffer-attribute>
      </ngt-sphere-geometry>
      <ngt-mesh-phong-material vertexColors></ngt-mesh-phong-material>
    </ngt-instanced-mesh>
  `,
  imports: [NgtInstancedMesh, NgtSphereGeometry, NgtInstancedBufferAttribute, NgtMeshPhongMaterial],
  providers: [NgtPhysicsBody],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
class Spheres implements OnInit {
  @Input() columns = 0;
  @Input() rows = 0;
  @Input() spread = 0;

  readonly sphereBody = inject(NgtPhysicsBody).useSphere<THREE.InstancedMesh>((index) => ({
    args: [0.2],
    mass: 1,
    position: [
      ((index % this.columns) - (this.columns - 1) / 2) * this.spread,
      2.0,
      (Math.floor(index / this.columns) - (this.rows - 1) / 2) * this.spread,
    ],
  }));

  colors!: Float32Array;

  get number() {
    return this.columns * this.rows;
  }

  ngOnInit() {
    this.colors = new Float32Array(this.number * 3);
    const color = new THREE.Color();
    for (let i = 0; i < this.number; i++) {
      color
        .set(niceColors[17][Math.floor(Math.random() * 5)])
        .convertSRGBToLinear()
        .toArray(this.colors, i * 3);
    }
  }
}

@Component({
  selector: 'height-field-geometry[elementSize][heights]',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(HeightFieldGeometry), provideCommonGeometryRef(HeightFieldGeometry)],
})
class HeightFieldGeometry extends NgtBufferGeometry implements OnInit {
  @Input() elementSize = 0;
  @Input() set heights(heights: number[][]) {
    this.set({ heights });
  }

  private readonly applyHeights = this.effect(
    tap(() => {
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

      this.instanceValue.setIndex(indices);
      this.instanceValue.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      this.instanceValue.computeVertexNormals();
      this.instanceValue.computeBoundingBox();
      this.instanceValue.computeBoundingSphere();
    })
  );

  override postInit() {
    super.postInit();
    this.applyHeights(
      this.select(
        this.instanceRef,
        this.select((s) => s['heights']),
        this.defaultProjector,
        { debounce: true }
      )
    );
  }
}

@Component({
  selector: 'height-field',
  standalone: true,
  template: `
    <ngt-mesh [ref]="heightFieldBody.ref" castShadow receiveShadow>
      <ngt-mesh-phong-material [color]="color"></ngt-mesh-phong-material>
      <height-field-geometry [elementSize]="elementSize" [heights]="heights"></height-field-geometry>
    </ngt-mesh>
  `,
  imports: [NgtMesh, NgtMeshPhongMaterial, HeightFieldGeometry],
  providers: [NgtPhysicsBody],
})
class HeightField {
  @Input() elementSize = 0;
  @Input() heights: number[][] = [];
  @Input() position: Triplet = [0, 0, 0];
  @Input() rotation: Triplet = [0, 0, 0];

  readonly color = niceColors[17][4];

  readonly heightFieldBody = inject(NgtPhysicsBody).useHeightfield<THREE.Mesh>(() => ({
    args: [this.heights, { elementSize: this.elementSize }],
    position: this.position,
    rotation: this.rotation,
  }));
}

@Component({
  selector: 'scene',
  standalone: true,
  template: `
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

      <height-field
        [elementSize]="scale / 128"
        [heights]="heights"
        [position]="[-scale / 2, 0, scale / 2]"
        [rotation]="[-90 | radian, 0, 0]"
      ></height-field>

      <spheres [rows]="3" [columns]="3" [spread]="4"></spheres>
    </ngt-physics>
  `,
  imports: [
    NgtColorAttribute,
    NgtSobaOrbitControls,
    NgtRadianPipe,
    NgtPhysics,
    NgtAmbientLight,
    NgtDirectionalLight,
    HeightField,
    Spheres,
  ],
})
class Scene {
  @Input() scale = 10;

  readonly heights = generateHeightmap({
    height: 128,
    number: 10,
    scale: 1,
    width: 128,
  });
}

@Component({
  selector: 'sandbox-height-field',
  standalone: true,
  template: `
    <ngt-canvas shadows [camera]="{ position: [0, -10, 10] }">
      <scene></scene>
    </ngt-canvas>
    <ngt-stats></ngt-stats>
  `,
  imports: [NgtCanvas, NgtStats, Scene],
})
export default class SandboxHeightField {}
