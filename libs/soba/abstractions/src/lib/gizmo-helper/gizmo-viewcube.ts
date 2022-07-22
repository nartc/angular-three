import {
  AnyFunction,
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  make,
  NGT_OBJECT_HOST_REF,
  NGT_OBJECT_REF,
  NgtEvent,
  NgtInstance,
  NgtInstanceState,
  NgtRepeat,
  NgtStore,
  NgtTriple,
  NgtVector3,
  NumberInput,
  Ref,
  startWithUndefined,
} from '@angular-three/core';
import { NgtBoxGeometry } from '@angular-three/core/geometries';
import { NgtGroup } from '@angular-three/core/group';
import { NgtAmbientLight, NgtPointLight } from '@angular-three/core/lights';
import { NgtMeshBasicMaterial, NgtMeshLambertMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/meshes';
import { AsyncPipe, NgForOf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  NgZone,
  Optional,
  Output,
  Self,
  SkipSelf,
} from '@angular/core';
import { takeUntil } from 'rxjs';
import * as THREE from 'three';
import { NgtSobaGizmoHelper } from './gizmo-helper';

const makePositionVector = (xyz: number[]) => make(THREE.Vector3, xyz as NgtVector3).multiplyScalar(0.38);

const colors = { bg: '#f0f0f0', hover: '#999', text: 'black', stroke: 'black' };
const defaultFaces = ['Right', 'Left', 'Top', 'Bottom', 'Front', 'Back'];

const corners: THREE.Vector3[] = [
  [1, 1, 1],
  [1, 1, -1],
  [1, -1, 1],
  [1, -1, -1],
  [-1, 1, 1],
  [-1, 1, -1],
  [-1, -1, 1],
  [-1, -1, -1],
].map(makePositionVector);

const cornerDimensions: NgtTriple = [0.25, 0.25, 0.25];

const edges: THREE.Vector3[] = [
  [1, 1, 0],
  [1, 0, 1],
  [1, 0, -1],
  [1, -1, 0],
  [0, 1, 1],
  [0, 1, -1],
  [0, -1, 1],
  [0, -1, -1],
  [-1, 1, 0],
  [-1, 0, 1],
  [-1, 0, -1],
  [-1, -1, 0],
].map(makePositionVector);

const edgeDimensions = edges.map(
  (edge) => edge.toArray().map((axis: number): number => (axis == 0 ? 0.5 : 0.25)) as NgtTriple
);

export interface NgtSobaGizmoViewCubeGenerticState<TPart extends object> extends NgtInstanceState<TPart> {
  font: string;
  opacity: number;
  color: string;
  hoverColor: string;
  textColor: string;
  strokeColor: string;
  faces: string[];
}

@Directive()
export abstract class NgtSobaGizmoViewCubeGeneric<TPart extends object> extends NgtInstance<
  TPart,
  NgtSobaGizmoViewCubeGenerticState<TPart>
> {
  @Input() set font(font: string) {
    this.set({ font });
  }
  get font() {
    return this.get((s) => s.font);
  }

  @Input() set opacity(opacity: NumberInput) {
    this.set({ opacity: coerceNumberProperty(opacity) });
  }
  get opacity() {
    return this.get((s) => s.opacity);
  }

  @Input() set color(color: string) {
    this.set({ color });
  }
  get color() {
    return this.get((s) => s.color);
  }

  @Input() set hoverColor(hoverColor: string) {
    this.set({ hoverColor });
  }
  get hoverColor() {
    return this.get((s) => s.hoverColor);
  }

  @Input() set textColor(textColor: string) {
    this.set({ textColor });
  }
  get textColor() {
    return this.get((s) => s.textColor);
  }

  @Input() set strokeColor(strokeColor: string) {
    this.set({ strokeColor });
  }
  get strokeColor() {
    return this.get((s) => s.strokeColor);
  }

  @Input() set faces(faces: string[]) {
    this.set({ faces });
  }
  get faces() {
    return this.get((s) => s.faces);
  }

  @Output() click = new EventEmitter<NgtEvent<MouseEvent>>();

  get raycast() {
    return this.gizmoHelper.get((s) => s.raycast);
  }

  constructor(
    zone: NgZone,
    store: NgtStore,
    @Optional()
    @SkipSelf()
    @Inject(NGT_OBJECT_REF)
    parentRef: AnyFunction<Ref>,
    @Optional()
    @SkipSelf()
    @Inject(NGT_OBJECT_HOST_REF)
    parentHostRef: AnyFunction<Ref>,
    @Optional() protected gizmoHelper: NgtSobaGizmoHelper
  ) {
    if (!gizmoHelper) {
      throw new Error(`<ngt-soba-gizmo-viewcube> can only be used in <ngt-soba-gizmo-helper>`);
    }
    super(zone, store, parentRef, parentHostRef);
  }

  protected override preInit(): void {
    super.preInit();
    this.set((state) => ({
      font: state.font ?? '20px Inter var, Arial, sans-serif',
      faces: state.faces ?? defaultFaces,
      color: state.color ?? colors.bg,
      hoverColor: state.hoverColor ?? colors.hover,
      textColor: state.textColor ?? colors.text,
      strokeColor: state.strokeColor ?? colors.stroke,
      opacity: state.opacity ?? 1,
    }));
  }
}

@Directive({
  selector: '[ngtSobaGizmoViewCubeGenericPassThrough]',
  standalone: true,
})
export class NgtSobaGizmoViewCubePassThrough {
  @Input() set ngtSobaGizmoViewCubeGenericPassThrough(wrapper: unknown) {
    this.assertWrapper(wrapper);

    wrapper
      .select(
        wrapper.select((s) => s.font).pipe(startWithUndefined()),
        wrapper.select((s) => s.opacity).pipe(startWithUndefined()),
        wrapper.select((s) => s.color).pipe(startWithUndefined()),
        wrapper.select((s) => s.hoverColor).pipe(startWithUndefined()),
        wrapper.select((s) => s.textColor).pipe(startWithUndefined()),
        wrapper.select((s) => s.strokeColor).pipe(startWithUndefined()),
        wrapper.select((s) => s.faces).pipe(startWithUndefined())
      )
      .pipe(takeUntil(wrapper.destroy$))
      .subscribe(() => {
        this.host.font = wrapper.font;
        this.host.opacity = wrapper.opacity;
        this.host.color = wrapper.color;
        this.host.hoverColor = wrapper.hoverColor;
        this.host.textColor = wrapper.textColor;
        this.host.strokeColor = wrapper.strokeColor;
        this.host.faces = wrapper.faces;
      });

    if (wrapper.click.observed) {
      this.host.click.pipe(takeUntil(wrapper.destroy$)).subscribe(wrapper.click.emit.bind(wrapper.click));
    }
  }

  constructor(@Self() @Optional() private host: NgtSobaGizmoViewCubeGeneric<any>) {
    if (!host) return;
  }

  private assertWrapper(wrapper: unknown): asserts wrapper is NgtSobaGizmoViewCubeGeneric<any> {
    if (!(wrapper instanceof NgtSobaGizmoViewCubeGeneric)) {
      throw new Error(`[NgtSobaGizmoViewCubePassThrough] wrapper is not an NgtSobaGizmoViewCubeGeneric`);
    }
  }
}

@Component({
  selector: 'ngt-soba-gizmo-face-material[hover][index]',
  standalone: true,
  template: `
    <ngt-mesh-lambert-material
      [ref]="instance"
      [map]="texture$ | async"
      [attach]="['material', '' + index]"
      [color]="hover ? hoverColor : 'white'"
      transparent
      [opacity]="opacity"
    ></ngt-mesh-lambert-material>
  `,
  imports: [NgtMeshLambertMaterial, AsyncPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NgtSobaGizmoViewCubeGeneric,
      useExisting: NgtSobaGizmoFaceMaterial,
    },
  ],
})
export class NgtSobaGizmoFaceMaterial extends NgtSobaGizmoViewCubeGeneric<THREE.MeshLambertMaterial> {
  @Input() set hover(hover: BooleanInput) {
    this.set({ hover: coerceBooleanProperty(hover) });
  }
  get hover() {
    return this.get((s) => s['hover']);
  }

  @Input() set index(index: NumberInput) {
    this.set({ index: coerceNumberProperty(index) });
  }
  get index() {
    return this.get((s) => s['index']);
  }

  readonly texture$ = this.select(
    this.select((s) => s['index']),
    this.select((s) => s.faces),
    this.select((s) => s.font),
    this.select((s) => s.color),
    this.select((s) => s.textColor),
    this.select((s) => s.strokeColor),
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
    }
  );
}

@Component({
  selector: 'ngt-soba-gizmo-face-cube',
  standalone: true,
  template: `
    <ngt-mesh
      [raycast]="raycast"
      (click)="onClick($event)"
      (pointerout)="onPointerOut($event)"
      (pointermove)="onPointerMove($event)"
    >
      <ngt-box-geometry></ngt-box-geometry>
      <ngt-soba-gizmo-face-material
        *ngFor="let index; repeat: 6"
        [hover]="hover === index"
        [index]="index"
        [ngtSobaGizmoViewCubeGenericPassThrough]="this"
      ></ngt-soba-gizmo-face-material>
    </ngt-mesh>
  `,
  imports: [NgtMesh, NgtBoxGeometry, NgtSobaGizmoFaceMaterial, NgtSobaGizmoViewCubePassThrough, NgtRepeat, NgForOf],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NgtSobaGizmoViewCubeGeneric,
      useExisting: NgtSobaGizmoFaceCube,
    },
  ],
})
export class NgtSobaGizmoFaceCube extends NgtSobaGizmoViewCubeGeneric<THREE.Mesh> {
  hover = -1;

  onClick($event: NgtEvent<MouseEvent>) {
    if (this.click.observed) {
      this.click.emit($event);
    } else {
      $event.stopPropagation();
      this.gizmoHelper.tweenCamera($event.face!.normal);
    }
  }

  onPointerOut($event: NgtEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = -1;
  }

  onPointerMove($event: NgtEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = Math.floor($event.faceIndex! / 2);
  }
}

@Component({
  selector: 'ngt-soba-gizmo-edge-cube[dimensions][position]',
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
        [color]="hover ? hoverColor : 'white'"
        transparent
        opacity="0.6"
        [visible]="hover"
      ></ngt-mesh-basic-material>
    </ngt-mesh>
  `,
  imports: [NgtMesh, NgtBoxGeometry, NgtMeshBasicMaterial],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NgtSobaGizmoViewCubeGeneric,
      useExisting: NgtSobaGizmoEdgeCube,
    },
  ],
})
export class NgtSobaGizmoEdgeCube extends NgtSobaGizmoViewCubeGeneric<THREE.Mesh> {
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

  onClick($event: NgtEvent<MouseEvent>) {
    if (this.click.observed) {
      this.click.emit($event);
    } else {
      $event.stopPropagation();
      this.gizmoHelper.tweenCamera(make(THREE.Vector3, this.position));
    }
  }

  onPointerOut($event: NgtEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = false;
  }

  onPointerOver($event: NgtEvent<PointerEvent>) {
    $event.stopPropagation();
    this.hover = true;
  }
}

@Component({
  selector: 'ngt-soba-gizmo-viewcube',
  standalone: true,
  template: `
    <ngt-group [scale]="60">
      <ngt-soba-gizmo-face-cube [ngtSobaGizmoViewCubeGenericPassThrough]="this"></ngt-soba-gizmo-face-cube>

      <ngt-soba-gizmo-edge-cube
        *ngFor="let edge of edges; index as i"
        [position]="edge"
        [dimensions]="edgeDimensions[i]"
        [ngtSobaGizmoViewCubeGenericPassThrough]="this"
      ></ngt-soba-gizmo-edge-cube>

      <ngt-soba-gizmo-edge-cube
        *ngFor="let corner of corners"
        [position]="corner"
        [dimensions]="cornerDimensions"
        [ngtSobaGizmoViewCubeGenericPassThrough]="this"
      ></ngt-soba-gizmo-edge-cube>

      <ngt-ambient-light intensity="0.5"></ngt-ambient-light>
      <ngt-point-light [position]="10" intensity="0.5"></ngt-point-light>
    </ngt-group>
  `,
  imports: [
    NgtGroup,
    NgtSobaGizmoFaceCube,
    NgtSobaGizmoEdgeCube,
    NgtAmbientLight,
    NgtPointLight,
    NgtSobaGizmoViewCubePassThrough,
    NgForOf,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NgtSobaGizmoViewCubeGeneric,
      useExisting: NgtSobaGizmoViewcube,
    },
  ],
})
export class NgtSobaGizmoViewcube extends NgtSobaGizmoViewCubeGeneric<THREE.Group> {
  readonly edges = edges;
  readonly edgeDimensions = edgeDimensions;

  readonly corners = corners;
  readonly cornerDimensions = cornerDimensions;
}

@NgModule({
  imports: [NgtSobaGizmoViewcube],
  exports: [NgtSobaGizmoViewcube],
})
export class NgtSobaGizmoViewcubeModule {}
