import type { AnimationReady, ThreeVector3 } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Mesh } from 'three';

@Component({
  selector: 'demo-box',
  template: `
    <ngt-mesh
      [position]="position"
      [scale]="active ? [1.5, 1.5, 1.5] : [1, 1, 1]"
      (pointerover)="color = 'hotpink'"
      (pointerout)="color = 'orange'"
      (click)="active = !active"
      (animateReady)="onBoxReady($event)"
    >
      <ngt-boxBufferGeometry></ngt-boxBufferGeometry>
      <ngt-meshStandardMaterial
        [parameters]="{ color: color }"
      ></ngt-meshStandardMaterial>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxComponent {
  @Input() position?: ThreeVector3;

  color = 'orange';
  active = false;

  onBoxReady({ animateObject }: AnimationReady<Mesh>) {
    animateObject.rotation.x = animateObject.rotation.y += 0.01;
  }
}
