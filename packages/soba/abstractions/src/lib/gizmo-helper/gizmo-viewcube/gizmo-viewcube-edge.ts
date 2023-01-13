import { extend, NgtArgs, NgtThreeEvent } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { BoxGeometry, Mesh, MeshBasicMaterial, Vector3 } from 'three';
import { injectNgtsGizmoHelperApi } from '../gizmo-helper';
import { colors } from './constants';
import { NgtsGizmoViewcubeInputs } from './gizmo-viewcube-inputs';

extend({ Mesh, BoxGeometry, MeshBasicMaterial });

@Component({
  selector: 'ngts-gizmo-viewcube-edge-cube[dimensions][position]',
  standalone: true,
  template: `
    <ngt-mesh
      scale="1.01"
      [position]="get('position')"
      (pointermove)="onPointerMove($any($event))"
      (pointerout)="onPointerOut($any($event))"
      (click)="onClick($any($event))"
    >
      <ngt-box-geometry *args="get('dimensions')" />
      <ngt-mesh-basic-material [color]="hover ? get('hoverColor') : 'white'" transparent opacity="0.6" [visible]="hover" />
    </ngt-mesh>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsGizmoViewcubeEdgeCube extends NgtsGizmoViewcubeInputs {
  readonly gizmoHelperApi = injectNgtsGizmoHelperApi();

  hover = false;

  @Input() set dimensions(dimensions: [number, number, number]) {
    this.set({ dimensions });
  }

  @Input() set position(position: Vector3) {
    this.set({ position });
  }

  override initialize(): void {
    super.initialize();
    this.set({ hoverColor: colors.hover });
  }

  onPointerMove(event: NgtThreeEvent<PointerEvent>) {
    event.stopPropagation();
    this.hover = true;
  }

  onPointerOut(event: NgtThreeEvent<PointerEvent>) {
    event.stopPropagation();
    this.hover = false;
  }

  onClick(event: NgtThreeEvent<MouseEvent>) {
    if (this.get('clickEmitter')?.observed) {
      this.get('clickEmitter').emit(event);
    } else {
      event.stopPropagation();
      this.gizmoHelperApi.tweenCamera(this.get('position'));
    }
  }
}
