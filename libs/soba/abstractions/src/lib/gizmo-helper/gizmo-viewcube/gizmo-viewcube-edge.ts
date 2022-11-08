import {
  make,
  NgtThreeEvent,
  NgtTriple,
  NgtVector3,
} from '@angular-three/core';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';
import {
  NgtSobaGizmoViewcubeInputs,
  provideNgtSobaViewCubeInputs,
} from './gizmo-viewcube-inputs';

@Component({
  selector: 'ngt-soba-gizmo-viewcube-edge-cube[dimensions][position]',
  standalone: true,
  template: `
    <ngt-mesh
      [scale]="1.01"
      [position]="position"
      [raycast]="raycast"
      (click)="onClick($event)"
      (pointerout)="onPointerOut($event)"
      (pointerover)="onPointerOver($event)"
    >
      <ngt-box-geometry [args]="dimensions"></ngt-box-geometry>
      <ngt-mesh-basic-material
        transparent
        opacity="0.6"
        [color]="hover ? hoverColor : 'white'"
        [visible]="hover"
      ></ngt-mesh-basic-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshBasicMaterial],
  providers: [provideNgtSobaViewCubeInputs(NgtSobaGizmoViewcubeEdgeCube)],
})
export class NgtSobaGizmoViewcubeEdgeCube extends NgtSobaGizmoViewcubeInputs {
  @Input() set dimensions(dimensions: NgtTriple) {
    this.set({ dimensions });
  }
  get dimensions() {
    return this.get((s) => s['dimensions']);
  }

  @Input() set position(position: NgtVector3) {
    this.set({ position });
  }
  get position() {
    return this.get((s) => s['position']);
  }

  hover = false;

  onClick($event: NgtThreeEvent<MouseEvent>) {
    if (this.click.observed) {
      this.click.emit($event);
    } else {
      $event.stopPropagation();
      this.gizmoHelper!.tweenCamera(make(THREE.Vector3, this.position));
    }
  }

  onPointerOut($event: NgtThreeEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = false;
  }

  onPointerOver($event: NgtThreeEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = true;
  }
}
