import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  NgtEvent,
  NgtInstance,
  NgtObjectPassThrough,
  NgtObjectProps,
  NgtRadianPipe,
  NgtTriple,
  NumberInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
  startWithUndefined,
} from '@angular-three/core';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtGroup } from '@angular-three/core/group';
import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtMeshBasicMaterial, NgtSpriteMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { NgtSprite } from '@angular-three/core/sprites';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, inject, Input, NgModule, Self } from '@angular/core';
import { takeUntil } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaGizmoHelper } from './gizmo-helper';

@Component({
  selector: 'ngt-soba-gizmo-viewport-axis[color][rotation]',
  standalone: true,
  template: `
    <ngt-group [rotation]="rotation">
      <ngt-mesh [position]="[0.4, 0, 0]">
        <ngt-box-geometry [args]="scale"></ngt-box-geometry>
        <ngt-mesh-basic-material [color]="color" toneMapped="false"></ngt-mesh-basic-material>
      </ngt-mesh>
    </ngt-group>
  `,
  imports: [NgtGroup, NgtMesh, NgtBoxGeometry, NgtMeshBasicMaterial],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaGizmoViewportAxis extends NgtInstance<THREE.Group> {
  @Input() set color(color: THREE.ColorRepresentation) {
    this.set({ color });
  }
  get color() {
    return this.get((s) => s['color']);
  }

  @Input() set rotation(rotation: NgtTriple) {
    this.set({ rotation });
  }
  get rotation() {
    return this.get((s) => s['rotation']);
  }

  @Input() set scale(scale: NgtTriple) {
    this.set({ scale });
  }
  get scale() {
    return this.get((s) => s['scale']);
  }

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      scale: state['scale'] ?? [0.8, 0.05, 0.05],
    }));
  }
}

@Component({
  selector:
    'ngt-soba-gizmo-viewport-axis-head[arcStyle][labelColor][font], ngt-soba-gizmo-viewport-axis-head[ngtSobaGizmoViewportAxisHead]',
  standalone: true,
  template: `
    <ngt-sprite
      [ngtObjectPassThrough]="this"
      [scale]="(scale$ | async)!"
      [raycast]="raycast"
      (pointerout)="onPointerOut($event)"
      (pointerover)="onPointerOver($event)"
      (pointerdown)="onPointerDown($event)"
    >
      <ngt-sprite-material
        [map]="texture$ | async"
        [opacity]="opacity$ | async"
        alphaTest="0.3"
        toneMapped="false"
      ></ngt-sprite-material>
    </ngt-sprite>
  `,
  imports: [NgtSprite, NgtObjectPassThrough, NgtSpriteMaterial, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtObject(NgtSobaGizmoViewportAxisHead),
    provideObjectRef(NgtSobaGizmoViewportAxisHead),
    provideObjectHostRef(NgtSobaGizmoViewportAxisHead),
  ],
})
export class NgtSobaGizmoViewportAxisHead extends NgtObjectProps<THREE.Sprite> {
  @Input() set arcStyle(arcStyle: string) {
    this.set({ arcStyle });
  }

  @Input() set label(label: string) {
    this.set({ label });
  }

  @Input() set labelColor(labelColor: string) {
    this.set({ labelColor });
  }

  @Input() set axisHeadScale(axisHeadScale: NumberInput) {
    this.set({ axisHeadScale: coerceNumberProperty(axisHeadScale) });
  }

  @Input() set disabled(disabled: BooleanInput) {
    this.set({ disabled: coerceBooleanProperty(disabled) });
  }

  @Input() set font(font: string) {
    this.set({ font });
  }

  private gizmoHelper = inject(NgtSobaGizmoHelper, { optional: true });

  constructor() {
    super();
    if (!this.gizmoHelper) {
      throw new Error(`<ngt-soba-gizmo-viewport> can only be used in <ngt-soba-gizmo-helper>`);
    }
  }

  override get raycast() {
    return this.gizmoHelper!.get((s) => s.raycast);
  }

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      axisHeadScale: state['axisHeadScale'] ?? 1,
      active: false,
    }));
  }

  readonly texture$ = this.select(
    this.select((s) => s['arcStyle']),
    this.select((s) => s['label']).pipe(startWithUndefined()),
    this.select((s) => s['labelColor']),
    this.select((s) => s['font']),
    (arcStyle, label, labelColor, font) => {
      const gl = this.store.get((s) => s.gl);

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

      return texture;
    }
  );

  readonly opacity$ = this.select(this.select((s) => s['label']).pipe(startWithUndefined()), (label) =>
    label ? 1 : 0.75
  );

  readonly scale$ = this.select(
    this.select((s) => s['active']),
    this.select((s) => s['label']).pipe(startWithUndefined()),
    this.select((s) => s['axisHeadScale']),
    (active, label, axisHeadScale) => (label ? 1 : 0.75) * (active ? 1.2 : 1) * axisHeadScale
  );

  onPointerOut($event: NgtEvent<PointerEvent>) {
    if (!this.disabled) {
      if (this.click.observed) {
        this.click.emit($event);
      } else {
        $event.stopPropagation();
        this.set({ active: false });
      }
    }
  }

  onPointerOver($event: NgtEvent<PointerEvent>) {
    if (!this.disabled) {
      $event.stopPropagation();
      this.set({ active: true });
    }
  }

  onPointerDown($event: NgtEvent<PointerEvent>) {
    if (!this.disabled) {
      this.gizmoHelper!.tweenCamera($event.object.position);
      $event.stopPropagation();
    }
  }
}

@Directive({
  selector: '[ngtSobaGizmoViewportAxisHead]',
  standalone: true,
})
export class NgtSobaGizmoViewportAxisHeadPassThrough {
  @Input() set ngtSobaGizmoViewportAxisHead(wrapper: unknown) {
    this.assertWrapper(wrapper);

    wrapper
      .select(
        wrapper.select((s) => s['labelColor']).pipe(startWithUndefined()),
        wrapper.select((s) => s['font']).pipe(startWithUndefined()),
        wrapper.select((s) => s['disabled']).pipe(startWithUndefined()),
        wrapper.select((s) => s['axisHeadScale']).pipe(startWithUndefined())
      )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.axisHead.labelColor = wrapper.labelColor;
        this.axisHead.font = wrapper.font;
        this.axisHead.disabled = wrapper.disabled;
        this.axisHead.axisHeadScale = wrapper.axisHeadScale;
      });

    if (wrapper.click.observed) {
      this.axisHead.click.pipe(takeUntil(wrapper.destroy$)).subscribe(wrapper.click.emit.bind(wrapper.click));
    }
  }

  constructor(@Self() private axisHead: NgtSobaGizmoViewportAxisHead) {}

  private assertWrapper(wrapper: unknown): asserts wrapper is NgtSobaGizmoViewport {
    if (!(wrapper instanceof NgtSobaGizmoViewport)) {
      throw new Error('wrapper must be NgtSobaGizmoViewport');
    }
  }
}

@Component({
  selector: 'ngt-soba-gizmo-viewport',
  standalone: true,
  template: `
    <ngt-group [ngtObjectPassThrough]="this" [scale]="40">
      <ngt-soba-gizmo-viewport-axis
        [color]="axisColors[0]"
        [rotation]="[0, 0, 0]"
        [scale]="axisScale"
      ></ngt-soba-gizmo-viewport-axis>
      <ngt-soba-gizmo-viewport-axis
        [color]="axisColors[1]"
        [rotation]="[0, 0, 90 | radian]"
        [scale]="axisScale"
      ></ngt-soba-gizmo-viewport-axis>
      <ngt-soba-gizmo-viewport-axis
        [color]="axisColors[2]"
        [rotation]="[0, -90 | radian, 0]"
        [scale]="axisScale"
      ></ngt-soba-gizmo-viewport-axis>

      <ng-container *ngIf="!hideAxisHeads">
        <ngt-soba-gizmo-viewport-axis-head
          [arcStyle]="axisColors[0]"
          [position]="[1, 0, 0]"
          [label]="labels[0]"
          [ngtSobaGizmoViewportAxisHead]="this"
        ></ngt-soba-gizmo-viewport-axis-head>
        <ngt-soba-gizmo-viewport-axis-head
          [arcStyle]="axisColors[1]"
          [position]="[0, 1, 0]"
          [label]="labels[1]"
          [ngtSobaGizmoViewportAxisHead]="this"
        ></ngt-soba-gizmo-viewport-axis-head>
        <ngt-soba-gizmo-viewport-axis-head
          [arcStyle]="axisColors[2]"
          [position]="[0, 0, 1]"
          [label]="labels[2]"
          [ngtSobaGizmoViewportAxisHead]="this"
        ></ngt-soba-gizmo-viewport-axis-head>
        <ng-container *ngIf="!hideNegativeAxes">
          <ngt-soba-gizmo-viewport-axis-head
            [arcStyle]="axisColors[0]"
            [position]="[-1, 0, 0]"
            [ngtSobaGizmoViewportAxisHead]="this"
          ></ngt-soba-gizmo-viewport-axis-head>
          <ngt-soba-gizmo-viewport-axis-head
            [arcStyle]="axisColors[1]"
            [position]="[0, -1, 0]"
            [ngtSobaGizmoViewportAxisHead]="this"
          ></ngt-soba-gizmo-viewport-axis-head>
          <ngt-soba-gizmo-viewport-axis-head
            [arcStyle]="axisColors[2]"
            [position]="[0, 0, -1]"
            [ngtSobaGizmoViewportAxisHead]="this"
          ></ngt-soba-gizmo-viewport-axis-head>
        </ng-container>
      </ng-container>

      <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
      <ngt-point-light [position]="10" intensity="0.5"></ngt-point-light>
    </ngt-group>
  `,
  imports: [
    NgtGroup,
    NgtObjectPassThrough,
    NgtAmbientLight,
    NgtPointLight,
    NgtSobaGizmoViewportAxis,
    NgtSobaGizmoViewportAxisHead,
    NgtSobaGizmoViewportAxisHeadPassThrough,
    NgtRadianPipe,
    NgIf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtObject(NgtSobaGizmoViewport),
    provideObjectRef(NgtSobaGizmoViewport),
    provideObjectHostRef(NgtSobaGizmoViewport),
  ],
})
export class NgtSobaGizmoViewport extends NgtObjectProps<THREE.Group> {
  @Input() set axisColors(axisColors: [string, string, string]) {
    this.set({ axisColors });
  }
  get axisColors() {
    return this.get((s) => s['axisColors']);
  }

  @Input() set axisScale(axisScale: NgtTriple) {
    this.set({ axisScale });
  }
  get axisScale() {
    return this.get((s) => s['axisScale']);
  }

  @Input() set labels(labels: [string, string, string]) {
    this.set({ labels });
  }
  get labels() {
    return this.get((s) => s['labels']);
  }

  @Input() set axisHeadScale(axisHeadScale: NumberInput) {
    this.set({ axisHeadScale: coerceNumberProperty(axisHeadScale) });
  }
  get axisHeadScale() {
    return this.get((s) => s['axisHeadScale']);
  }

  @Input() set labelColor(labelColor: string) {
    this.set({ labelColor });
  }
  get labelColor() {
    return this.get((s) => s['labelColor']);
  }

  @Input() set hideNegativeAxes(hideNegativeAxes: BooleanInput) {
    this.set({ hideNegativeAxes: coerceBooleanProperty(hideNegativeAxes) });
  }
  get hideNegativeAxes() {
    return this.get((s) => s['hideNegativeAxes']);
  }

  @Input() set hideAxisHeads(hideAxisHeads: BooleanInput) {
    this.set({ hideAxisHeads: coerceBooleanProperty(hideAxisHeads) });
  }
  get hideAxisHeads() {
    return this.get((s) => s['hideAxisHeads']);
  }

  @Input() set disabled(disabled: BooleanInput) {
    this.set({ disabled: coerceBooleanProperty(disabled) });
  }
  get disabled() {
    return this.get((s) => s['disabled']);
  }

  @Input() set font(font: string) {
    this.set({ font });
  }
  get font() {
    return this.get((s) => s['font']);
  }

  protected override preInit() {
    super.preInit();
    this.set((state) => ({
      font: state['font'] ?? '18px Inter var, Arial, sans-serif',
      axisColors: state['axisColors'] ?? ['#ff3653', '#0adb50', '#2c8fdf'],
      axisHeadScale: state['axisHeadScale'] ?? 1,
      labels: state['labels'] ?? ['X', 'Y', 'Z'],
      labelColor: state['labelColor'] ?? '#000',
    }));
  }
}

@NgModule({
  imports: [NgtSobaGizmoViewport],
  exports: [NgtSobaGizmoViewport],
})
export class NgtSobaGizmoViewportModule {}
