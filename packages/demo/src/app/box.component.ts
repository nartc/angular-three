import type { ThreeVector3 } from '@angular-three/core';
import { AnimationStore } from '@angular-three/core';
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
      (ready)="onBoxReady($event)"
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

  constructor(private readonly animationStore: AnimationStore) {}

  color = 'orange';
  active = false;

  onBoxReady(box: Mesh) {
    this.animationStore.registerAnimation(box, (mesh) => {
      mesh.rotation.x = mesh.rotation.y += 0.01;
    });
  }
}
