import {
  extend,
  injectNgtStore,
  NgtArgs,
  NgtRxStore,
  NgtThreeEvent,
  startWithUndefined,
} from '@angular-three/core';
import { DOCUMENT } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, inject, Input } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { combineLatest, map } from 'rxjs';
import {
  BoxGeometry,
  CanvasTexture,
  Group,
  Mesh,
  MeshBasicMaterial,
  Sprite,
  SpriteMaterial,
} from 'three';

extend({ Group, Mesh, BoxGeometry, MeshBasicMaterial, Sprite, SpriteMaterial });

@Component({
  selector: 'ngts-gizmo-viewport-axis[color][rotation]',
  standalone: true,
  template: `
    <ngt-group [rotation]="get('rotation')">
      <ngt-mesh [position]="[0.4, 0, 0]">
        <ngt-box-geometry *args="get('scale')" />
        <ngt-mesh-basic-material [color]="get('color')" toneMapped="false" />
      </ngt-mesh>
    </ngt-group>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsGizmoViewportAxis extends NgtRxStore {
  @Input() set color(color: string) {
    this.set({ color });
  }

  @Input() set rotation(rotation: [number, number, number]) {
    this.set({ rotation });
  }

  @Input() set scale(scale: [number, number, number]) {
    this.set({ scale: scale === undefined ? this.get('scale') : scale });
  }

  override initialize(): void {
    super.initialize();
    this.set({ scale: [0.8, 0.05, 0.05] });
  }
}

@Component({
  selector: 'ngts-gizmo-viewport-axis-head',
  standalone: true,
  template: `
    <ngt-sprite
      ngtCompound
      [scale]="get('scale')"
      (pointerover)="onPointerOver($any($event))"
      (pointerout)="onPointerOut($any($event))"
    >
      <ngt-sprite-material
        [map]="get('texture')"
        [opacity]="get('label') ? 1 : 0.75"
        alphaTest="0.3"
        toneMapped="false"
      >
        <ngt-value *args="[gl.outputEncoding]" attach="map.encoding" />
        <ngt-value *args="[gl.capabilities.getMaxAnisotropy() || 1]" attach="map.anisotropy" />
      </ngt-sprite-material>
    </ngt-sprite>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsGizmoViewportAxisHead extends NgtRxStore {
  readonly #document = inject(DOCUMENT);
  readonly #store = injectNgtStore();
  readonly gl = this.#store.get('gl');

  @Input() set arcStyle(arcStyle: string) {
    this.set({ arcStyle });
  }

  @Input() set label(label: string) {
    this.set({ label });
  }

  @Input() set labelColor(labelColor: string) {
    this.set({ labelColor });
  }

  @Input() set axisHeadScale(axisHeadScale: number) {
    this.set({
      axisHeadScale: axisHeadScale === undefined ? this.get('axisHeadScale') : axisHeadScale,
    });
  }

  @Input() set disabled(disabled: boolean) {
    this.set({ disabled });
  }

  @Input() set font(font: string) {
    this.set({ font });
  }

  @Input() set clickEmitter(clickEmitter: EventEmitter<NgtThreeEvent<MouseEvent>>) {
    this.set({ clickEmitter });
  }

  override initialize(): void {
    super.initialize();
    this.set({ axisHeadScale: 1, active: false });
    this.connect(
      'texture',
      combineLatest([
        this.select(selectSlice(['arcStyle', 'labelColor', 'font'])),
        this.select('label').pipe(startWithUndefined()),
      ]).pipe(
        map(([{ arcStyle, labelColor, font }, label]) => {
          const canvas = this.#document.createElement('canvas');
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
          return new CanvasTexture(canvas);
        })
      )
    );
    this.connect(
      'scale',
      combineLatest([
        this.select('active'),
        this.select('axisHeadScale'),
        this.select('label').pipe(startWithUndefined()),
      ]).pipe(
        map(
          ([active, axisHeadScale, label]) =>
            (label ? 1 : 0.75) * (active ? 1.2 : 1) * axisHeadScale
        )
      )
    );
  }

  onPointerOver(event: NgtThreeEvent<PointerEvent>) {
    if (!this.get('disabled')) {
      event.stopPropagation();
      this.set({ active: true });
    }
  }

  onPointerOut(event: NgtThreeEvent<PointerEvent>) {
    if (!this.get('disabled')) {
      if (this.get('clickEmitter')?.observed) {
        this.get('clickEmitter').emit(event);
      } else {
        event.stopPropagation();
        this.set({ active: false });
      }
    }
  }
}
