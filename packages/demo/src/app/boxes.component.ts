import type { AnimationReady, ThreeEvent } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgZone } from '@angular/core';
// @ts-ignore
import niceColors from 'nice-color-palettes';
import { Color, InstancedMesh, Object3D } from 'three';

const colors = new Array(1000)
  .fill(undefined)
  .map(() => niceColors[17][Math.floor(Math.random() * 5)]);

@Component({
  selector: 'demo-boxes',
  template: `
    <ngt-instanced-mesh
      [args]="[1000]"
      (pointermove)="onHover($event)"
      (pointerout)="onOffHover()"
      (animateReady)="onReady($event)"
    >
      <ngt-box-geometry [args]="[0.7, 0.7, 0.7]">
        <ngt-instanced-buffer-attribute
          attach="color"
          [args]="[colorArray, 3]"
        ></ngt-instanced-buffer-attribute>
      </ngt-box-geometry>
      <ngt-mesh-phong-material
        [parameters]="{ vertexColors: true }"
      ></ngt-mesh-phong-material>
    </ngt-instanced-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxesComponent {
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

  constructor(private readonly ngZone: NgZone) {}

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

  onReady({
    animateObject,
    renderState: { clock },
  }: AnimationReady<InstancedMesh>) {
    const time = clock.getElapsedTime();
    animateObject.rotation.x = Math.sin(time / 4);
    animateObject.rotation.y = Math.sin(time / 2);
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
            animateObject.geometry.attributes.color.needsUpdate = true;
          }
          const scale = id === this.hovered ? 2 : 1;
          this.tempObject.scale.set(scale, scale, scale);
          this.tempObject.updateMatrix();
          animateObject.setMatrixAt(id, this.tempObject.matrix);
        }
    animateObject.instanceMatrix.needsUpdate = true;
  }
}
