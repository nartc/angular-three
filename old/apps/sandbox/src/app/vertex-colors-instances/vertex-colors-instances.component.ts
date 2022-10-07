import { checkNeedsUpdate, NgtCanvas } from '@angular-three/core';
import { NgtInstancedBufferAttribute } from '@angular-three/core/attributes';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtAmbientLight, NgtDirectionalLight } from '@angular-three/core/lights';
import { NgtMeshLambertMaterial } from '@angular-three/core/materials';
import { NgtInstancedMesh } from '@angular-three/core/meshes';
import { NgtSobaOrbitControls } from '@angular-three/soba/controls';
import { ChangeDetectionStrategy, Component } from '@angular/core';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import * as THREE from 'three';

const niceColor = niceColors[Math.floor(Math.random() * niceColors.length)];

@Component({
  selector: 'sandbox-instances',
  standalone: true,
  template: `
    <ngt-instanced-mesh (ready)="onReady($event)" [count]="length">
      <ngt-box-geometry [args]="[0.15, 0.15, 0.15]">
        <ngt-instanced-buffer-attribute
          [attach]="['attributes', 'color']"
          [args]="[colorArray, 3]"
        ></ngt-instanced-buffer-attribute>
      </ngt-box-geometry>
      <ngt-mesh-lambert-material vertexColors toneMapped="false"></ngt-mesh-lambert-material>
    </ngt-instanced-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtInstancedMesh, NgtBoxGeometry, NgtInstancedBufferAttribute, NgtMeshLambertMaterial],
})
export class Instances {
  readonly length = 125000;
  readonly o = new THREE.Object3D();
  readonly c = new THREE.Color();
  readonly colors = Array.from({ length: this.length }, () => niceColor[Math.floor(Math.random() * 5)]);

  colorArray = Float32Array.from(
    Array.from({ length: this.length }, (_, index) =>
      this.c.set(this.colors[index]).convertSRGBToLinear().toArray()
    ).flat()
  );

  onReady($event: THREE.InstancedMesh) {
    let i = 0;
    for (let x = 0; x < 50; x++) {
      for (let y = 0; y < 50; y++) {
        for (let z = 0; z < 50; z++) {
          const id = i++;
          this.o.position.set(25 - x, 25 - y, 25 - z);
          this.o.updateMatrix();
          $event.setMatrixAt(id, this.o.matrix);
        }
      }
    }
    checkNeedsUpdate($event.instanceMatrix);
  }
}

@Component({
  selector: 'sandbox-scene',
  standalone: true,
  template: `
    <ngt-ambient-light></ngt-ambient-light>
    <ngt-directional-light [position]="[150, 150, 150]" intensity="0.55"></ngt-directional-light>

    <sandbox-instances></sandbox-instances>

    <ngt-soba-orbit-controls enablePan="false" autoRotate></ngt-soba-orbit-controls>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtAmbientLight, NgtDirectionalLight, Instances, NgtSobaOrbitControls],
})
export class Scene {}

@Component({
  selector: 'sandbox-vertex-colors-instances',
  standalone: true,
  template: `
    <ngt-canvas [camera]="{ position: [0, 0, 0.1] }">
      <sandbox-scene></sandbox-scene>
    </ngt-canvas>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtCanvas, Scene],
})
export class VertexColorsInstancesComponent {}
