import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtRepeat,
  NgtThreeEvent,
  NumberInput,
} from '@angular-three/core';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshLambertMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { AsyncPipe, NgForOf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';
import {
  NgtSobaGizmoViewcubeInputs,
  NgtSobaGizmoViewcubeInputsPassThrough,
  provideNgtSobaViewCubeInputs,
} from './gizmo-viewcube-inputs';

@Component({
  selector: 'ngt-soba-gizmo-viewcube-face-material[hover][index]',
  standalone: true,
  template: `
    <ngt-mesh-lambert-material
      [ref]="instance"
      [map]="texture$ | async"
      [attach]="['material', index]"
      [color]="hover ? hoverColor : 'white'"
      transparent
      [opacity]="opacity"
    ></ngt-mesh-lambert-material>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgtMeshLambertMaterial, AsyncPipe],
  providers: [provideNgtSobaViewCubeInputs(NgtSobaGizmoViewcubeFaceMaterial)],
})
export class NgtSobaGizmoViewcubeFaceMaterial extends NgtSobaGizmoViewcubeInputs {
  @Input() set hover(hover: BooleanInput) {
    this.set({ hover: coerceBooleanProperty(hover) });
  }
  get hover() {
    return this.get((s) => s['hover']);
  }

  @Input() set index(index: NumberInput) {
    this.set({ index: coerceNumberProperty(index) });
  }
  get index(): number {
    return this.get((s) => s['index']);
  }

  readonly texture$ = this.select(
    this.select((s) => s['index']),
    this.select((s) => s['faces']),
    this.select((s) => s['font']),
    this.select((s) => s['color']),
    this.select((s) => s['textColor']),
    this.select((s) => s['strokeColor']),
    () => {
      const gl = this.store.get((s) => s.gl);
      const { color, strokeColor, textColor, font, faces, index } = this.get();
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const context = canvas.getContext('2d')!;
      context.fillStyle = color;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = strokeColor;
      context.strokeRect(0, 0, canvas.width, canvas.height);
      context.font = font;
      context.textAlign = 'center';
      context.fillStyle = textColor;
      context.fillText(faces[index].toUpperCase(), 64, 76);
      const texture = new THREE.CanvasTexture(canvas);

      texture.encoding = gl.outputEncoding;
      texture.anisotropy = gl.capabilities.getMaxAnisotropy() || 1;

      return texture;
    },
    { debounce: true }
  );
}

@Component({
  selector: 'ngt-soba-gizmo-viewcube-face-cube',
  standalone: true,
  template: `
    <ngt-mesh
      [raycast]="raycast"
      (click)="onClick($event)"
      (pointerout)="onPointerOut($event)"
      (pointermove)="onPointerMove($event)"
    >
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-soba-gizmo-viewcube-face-material
        *ngFor="let index; repeat: 6"
        [hover]="hover === index"
        [index]="index"
        [ngtSobaGizmoViewcubeInputsPassThrough]="this"
      ></ngt-soba-gizmo-viewcube-face-material>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtMesh,
    NgtBoxGeometry,
    NgtSobaGizmoViewcubeFaceMaterial,
    NgtSobaGizmoViewcubeInputsPassThrough,
    NgForOf,
    NgtRepeat,
  ],
  providers: [provideNgtSobaViewCubeInputs(NgtSobaGizmoViewcubeFaceCube)],
})
export class NgtSobaGizmoViewcubeFaceCube extends NgtSobaGizmoViewcubeInputs {
  hover = -1;

  onClick($event: NgtThreeEvent<MouseEvent>) {
    if (this.click.observed) {
      this.click.emit($event);
    } else {
      $event.stopPropagation();
      this.gizmoHelper!.tweenCamera($event.face!.normal);
    }
  }

  onPointerOut($event: NgtThreeEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = -1;
  }

  onPointerMove($event: NgtThreeEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = Math.floor(($event.faceIndex || 0) / 2);
  }
}
