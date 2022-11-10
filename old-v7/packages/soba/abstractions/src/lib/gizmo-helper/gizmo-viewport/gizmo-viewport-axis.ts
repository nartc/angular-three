import {
  checkNeedsUpdate,
  coerceBoolean,
  coerceNumber,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObjectPassThrough,
  NgtThreeEvent,
  NgtTriple,
} from '@angular-three/core';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterial, NgtSpriteMaterial } from '@angular-three/core/materials';
import { NgtGroup, NgtMesh, NgtSprite } from '@angular-three/core/objects';
import { Component, inject, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtSobaGizmoHelper } from '../gizmo-helper';

@Component({
  selector: 'ngt-soba-gizmo-viewport-axis',
  standalone: true,
  template: `
    <ngt-group name="viewport-axis" [rotation]="rotation">
      <ngt-mesh [position]="[0.4, 0, 0]">
        <ngt-box-geometry [args]="scale"></ngt-box-geometry>
        <ngt-mesh-basic-material [color]="color!" toneMapped="false"></ngt-mesh-basic-material>
      </ngt-mesh>
    </ngt-group>
  `,
  imports: [NgtGroup, NgtMesh, NgtBoxGeometry, NgtMeshBasicMaterial],
})
export class NgtSobaGizmoViewportAxis {
  @Input() color?: THREE.ColorRepresentation;
  @Input() rotation?: NgtTriple;
  @Input() scale?: NgtTriple;
}

@Component({
  selector: 'ngt-soba-gizmo-viewport-axis-head',
  standalone: true,
  template: `
    <ngt-sprite
      [ngtObjectPassThrough]="this"
      [scale]="scale$"
      [raycast]="gizmoRaycast"
      (pointerout)="onPointerOut($event)"
      (pointerover)="onPointerOver($event)"
      (pointerdown)="onPointerDown($event)"
    >
      <ngt-sprite-material
        alphaTest="0.3"
        toneMapped="false"
        [map]="texture$"
        [opacity]="opacity$"
      ></ngt-sprite-material>
    </ngt-sprite>
  `,
  imports: [NgtSprite, NgtSpriteMaterial, NgtObjectPassThrough],
})
export class NgtSobaGizmoViewportAxisHead extends NgtSprite {
  override isWrapper = true;

  @Input() set arcStyle(arcStyle: string) {
    this.set({ arcStyle });
  }

  @Input() set label(label: string) {
    this.set({ label });
  }

  @Input() set labelColor(labelColor: string) {
    this.set({ labelColor });
  }

  @Input() set axisHeadScale(axisHeadScale: NgtNumberInput) {
    this.set({ axisHeadScale: coerceNumber(axisHeadScale) });
  }

  @Input() set disabled(disabled: NgtBooleanInput) {
    this.set({ disabled: coerceBoolean(disabled) });
  }

  @Input() set font(font: string) {
    this.set({ font });
  }

  private readonly _gizmoHelper = inject(NgtSobaGizmoHelper, {
    optional: true,
  });

  get gizmoHelper() {
    return this._gizmoHelper as NgtSobaGizmoHelper;
  }

  get gizmoRaycast() {
    return this.gizmoHelper.getState((s) => s['gizmoRaycast']) as THREE.Object3D['raycast'];
  }

  readonly texture$ = this.select(
    this.select((s) => s['arcStyle']),
    this.select((s) => s['label']),
    this.select((s) => s['labelColor']),
    this.select((s) => s['font']),
    (arcStyle, label, labelColor, font) => {
      const gl = this.store.getState((s) => s.gl);

      const canvas = this.document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;

      const context = canvas.getContext('2d')!;
      context.beginPath();
      context.arc(32, 32, 16, 0, 2 * Math.PI);
      context.closePath();
      context.fillStyle = arcStyle;
      context.fill();

      if (label) {
        context.font = font;
        context.textAlign = 'center';
        context.fillStyle = labelColor;
        context.fillText(label, 32, 41);
      }
      const texture = new THREE.CanvasTexture(canvas);

      texture.encoding = gl.outputEncoding;
      texture.anisotropy = gl.capabilities.getMaxAnisotropy() || 1;

      checkNeedsUpdate(texture);

      return texture;
    },
    { debounce: true }
  );

  readonly opacity$ = this.select(
    this.select((s) => s['label']),
    (label) => (label ? 1 : 0.75),
    { debounce: true }
  );

  readonly scale$ = this.select(
    this.select((s) => s['active']),
    this.select((s) => s['label']),
    this.select((s) => s['axisHeadScale']),
    (active, label, axisHeadScale) => (label ? 1 : 0.75) * (active ? 1.2 : 1) * axisHeadScale,
    { debounce: true }
  );

  override initialize() {
    super.initialize();
    this.set({
      axisHeadScale: 1,
      active: false,
      label: '',
    });
  }

  onPointerOut($event: NgtThreeEvent<PointerEvent>) {
    if (!this.disabled) {
      if (this.click.observed) {
        this.click.emit($event);
      } else {
        $event.stopPropagation();
        this.set({ active: false });
      }
    }
  }

  onPointerOver($event: NgtThreeEvent<PointerEvent>) {
    if (!this.disabled) {
      $event.stopPropagation();
      this.set({ active: true });
    }
  }

  onPointerDown($event: NgtThreeEvent<PointerEvent>) {
    if (!this.disabled) {
      this.gizmoHelper.tweenCamera($event.object.position);
      $event.stopPropagation();
    }
  }
}
