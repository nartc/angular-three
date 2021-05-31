import type { AnimationReady, ThreeVector3 } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Mesh } from 'three';

@Component({
  selector: 'demo-box',
  template: `
    <ngt-mesh
      o3d
      [ngtPop]="['scale', active ? [1.5, 1.5, 1.5] : [1, 1, 1]]"
      [ngtPopValueGetter]="'toArray'"
      [scale]="[1, 1, 1]"
      [position]="position"
      (pointerover)="hovered = true"
      (pointerout)="hovered = false"
      (click)="active = !active"
      (animateReady)="onBoxReady($event)"
    >
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-mesh-standard-material
        [ngtPop]="['color', hovered ? 'rgb(255,105,180)' : 'rgb(255,165,0)']"
        [ngtPopValueGetter]="'getStyle'"
        [parameters]="{
          color: 'rgb(255,165,0)'
        }"
      ></ngt-mesh-standard-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxComponent {
  @Input() position?: ThreeVector3;

  hovered = false;
  active = false;

  onBoxReady({ animateObject }: AnimationReady<Mesh>) {
    animateObject.rotation.x = animateObject.rotation.y += 0.01;
  }
}
