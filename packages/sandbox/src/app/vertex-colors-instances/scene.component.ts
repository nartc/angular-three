import { extend, NgtArgs } from '@angular-three/core';
import { NgtsOrbitControls } from '@angular-three/soba/controls';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  InstancedBufferAttribute,
  InstancedMesh,
  MeshLambertMaterial,
  Object3D,
} from 'three';
// @ts-ignore
import niceColors from 'nice-color-palettes';
const niceColor = niceColors[Math.floor(Math.random() * niceColors.length)];

extend({
  InstancedMesh,
  BoxGeometry,
  MeshLambertMaterial,
  AmbientLight,
  DirectionalLight,
  InstancedBufferAttribute,
});

@Component({
  selector: 'sandbox-colors-instances',
  standalone: true,
  template: `
    <ngt-instanced-mesh #instanced *args="[undefined, undefined, length]">
      <ngt-box-geometry *args="[0.15, 0.15, 0.15]">
        <ngt-instanced-buffer-attribute
          attach="attributes.color"
          *args="[colors, 3]"
        ></ngt-instanced-buffer-attribute>
      </ngt-box-geometry>
      <ngt-mesh-lambert-material vertexColors toneMapped="false"></ngt-mesh-lambert-material>
    </ngt-instanced-mesh>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ColorsInstances {
  readonly length = 125000;

  readonly #o = new Object3D();
  readonly #c = new Color();
  readonly #colors = Array.from(
    { length: this.length },
    () => niceColor[Math.floor(Math.random() * 5)]
  );

  readonly colors = Float32Array.from(
    Array.from({ length: this.length }, (_, index) =>
      this.#c.set(this.#colors[index]).convertSRGBToLinear().toArray()
    ).flat()
  );

  @ViewChild('instanced') set instanced(instanced: ElementRef<InstancedMesh>) {
    let i = 0;
    for (let x = 0; x < 50; x++) {
      for (let y = 0; y < 50; y++) {
        for (let z = 0; z < 50; z++) {
          const id = i++;
          this.#o.position.set(25 - x, 25 - y, 25 - z);
          this.#o.updateMatrix();
          instanced.nativeElement.setMatrixAt(id, this.#o.matrix);
        }
      }
    }
    instanced.nativeElement.instanceMatrix.needsUpdate = true;
  }
}

@Component({
  selector: 'sandbox-vertex-colors-instances-scene',
  standalone: true,
  template: `
    <ngt-ambient-light></ngt-ambient-light>
    <ngt-directional-light intensity="0.55" [position]="150"></ngt-directional-light>

    <sandbox-colors-instances></sandbox-colors-instances>

    <ngts-orbit-controls [autoRotate]="true" [enablePan]="false"></ngts-orbit-controls>
  `,
  imports: [ColorsInstances, NgtsOrbitControls],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Scene {}
