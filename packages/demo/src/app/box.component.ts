import type { ThreeVector3 } from '@angular-three/core';
import { AnimationStore } from '@angular-three/core';
import { MeshDirective } from '@angular-three/core/meshes';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'demo-box',
  template: `
    <ngt-mesh
      [position]="position"
      [scale]="active ? [1.5, 1.5, 1.5] : [1, 1, 1]"
      (pointerover)="color = 'hotpink'"
      (pointerout)="color = 'orange'"
      (click)="active = !active"
    >
      <ngt-boxBufferGeometry></ngt-boxBufferGeometry>
      <ngt-meshStandardMaterial
        [parameters]="{ color: color }"
      ></ngt-meshStandardMaterial>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoxComponent implements AfterViewInit {
  @Input() position?: ThreeVector3;

  @ViewChild(MeshDirective) mesh!: MeshDirective;

  constructor(private readonly animationStore: AnimationStore) {}

  color = 'orange';
  active = false;

  ngAfterViewInit() {
    this.animationStore.registerAnimation(this.mesh.object3d$, (mesh) => {
      mesh.rotation.x = mesh.rotation.y += 0.01;
    });
  }
}
