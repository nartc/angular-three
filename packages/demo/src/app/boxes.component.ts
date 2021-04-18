import type { ThreeEvent } from '@angular-three/core';
import { AnimationStore } from '@angular-three/core';
import { InstancedMeshDirective } from '@angular-three/core/meshes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  NgZone,
  ViewChild,
} from '@angular/core';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import { Color, Object3D } from 'three';

const colors = new Array(1000)
  .fill(undefined)
  .map(() => niceColors[17][Math.floor(Math.random() * 5)]);

@Component({
  selector: 'demo-boxes',
  template: `
    <ngt-instancedMesh
      [args]="[1000]"
      (pointermove)="onHover($event)"
      (pointerout)="onOffHover()"
    >
      <ngt-boxBufferGeometry [args]="[0.7, 0.7, 0.7]">
        <ngt-instancedBufferAttribute
          attach="color"
          [args]="[colorArray, 3]"
        ></ngt-instancedBufferAttribute>
      </ngt-boxBufferGeometry>
      <ngt-meshPhongMaterial
        [parameters]="{ vertexColors: true }"
      ></ngt-meshPhongMaterial>
    </ngt-instancedMesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxesComponent implements AfterViewInit {
  tempObject = new Object3D();
  tempColor = new Color();
  colorArray = Float32Array.from(
    ([] as number[]).concat.apply(
      [],
      new Array(1000)
        .fill(undefined)
        .map((_, i) => this.tempColor.set(colors[i]).toArray())
    )
  );

  hovered?: number;
  previous?: number;

  @ViewChild(InstancedMeshDirective) instancedMesh!: InstancedMeshDirective;

  constructor(
    private readonly animationStore: AnimationStore,
    private readonly ngZone: NgZone
  ) {}

  ngAfterViewInit() {
    this.animationStore.registerAnimation(
      this.instancedMesh.object3d$,
      (mesh, { clock }) => {
        const time = clock.getElapsedTime();
        mesh.rotation.x = Math.sin(time / 4);
        mesh.rotation.y = Math.sin(time / 2);
        let i = 0;
        for (let x = 0; x < 10; x++)
          for (let y = 0; y < 10; y++)
            for (let z = 0; z < 10; z++) {
              const id = i++;
              this.tempObject.position.set(5 - x, 5 - y, 5 - z);
              this.tempObject.rotation.y =
                Math.sin(x / 4 + time) +
                Math.sin(y / 4 + time) +
                Math.sin(z / 4 + time);
              this.tempObject.rotation.z = this.tempObject.rotation.y * 2;
              if (this.hovered !== this.previous) {
                this.tempColor
                  .set(id === this.hovered ? 'white' : colors[id])
                  .toArray(this.colorArray, id * 3);
                mesh.geometry.attributes.color.needsUpdate = true;
              }
              const scale = id === this.hovered ? 2 : 1;
              this.tempObject.scale.set(scale, scale, scale);
              this.tempObject.updateMatrix();
              mesh.setMatrixAt(id, this.tempObject.matrix);
            }
        mesh.instanceMatrix.needsUpdate = true;
      }
    );
  }

  onHover($event: ThreeEvent<PointerEvent>) {
    this.hovered = $event.instanceId;
    this.ngZone.runOutsideAngular(() => {
      this.previous = this.hovered;
    });
  }

  onOffHover() {
    this.hovered = undefined;
    this.ngZone.runOutsideAngular(() => {
      this.previous = undefined;
    });
  }
}
