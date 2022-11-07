import {
  BooleanInput,
  coerceBooleanProperty,
  coerceNumberProperty,
  make,
  NgtObject,
  NgtObjectInputsState,
  NgtObjectPassThrough,
  NgtTriple,
  NgtVector2,
  NumberInput,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
} from '@angular-three/core';
import { NgtMesh } from '@angular-three/core/objects';
import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  animationFrameScheduler,
  filter,
  Observable,
  observeOn,
  pipe,
  tap,
} from 'rxjs';
import * as THREE from 'three';
import { Line2 } from 'three-stdlib';
import { NgtSobaLineGeometry } from './line-geometry';
import { NgtSobaLineMaterial } from './line-material';

export interface NgtSobaLineState extends NgtObjectInputsState<Line2> {
  points: Array<THREE.Vector3 | NgtTriple>;
  vertexColors: Array<THREE.Color | NgtTriple>;
  dashed: boolean;
  resolution: NgtVector2;
  lineWidth?: number;
}

@Component({
  selector: 'ngt-soba-line',
  standalone: true,
  template: `
    <ngt-mesh skipInit [ngtObjectPassThrough]="this">
      <ngt-soba-line-geometry
        *ngIf="geometryProps$ | async as geometryProps"
        [points]="geometryProps.points"
        [vertexColors]="geometryProps.vertexColors"
      ></ngt-soba-line-geometry>
      <ngt-soba-line-material
        *ngIf="materialProps$ | async as materialProps"
        [dashed]="materialProps.dashed"
        [color]="materialProps.color"
        [resolution]="materialProps.resolution"
        [linewidth]="materialProps.lineWidth"
        [vertexColors]="materialProps.vertexColors"
      ></ngt-soba-line-material>
      <ng-content></ng-content>
    </ngt-mesh>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgtMesh,
    NgtObjectPassThrough,
    NgtSobaLineGeometry,
    NgtSobaLineMaterial,
    NgIf,
    AsyncPipe,
  ],
  providers: [
    provideNgtObject(NgtSobaLine),
    provideObjectRef(NgtSobaLine),
    provideObjectHostRef(NgtSobaLine),
  ],
})
export class NgtSobaLine extends NgtObject<Line2, NgtSobaLineState> {
  override shouldPassThroughRef = true;

  @Input() set points(points: Array<THREE.Vector3 | NgtTriple>) {
    this.set({ points });
  }

  @Input() set vertexColors(vertexColors: Array<THREE.Color | NgtTriple>) {
    this.set({ vertexColors });
  }

  @Input() set dashed(dashed: BooleanInput) {
    this.set({ dashed: coerceBooleanProperty(dashed) });
  }

  @Input() set lineWidth(lineWidth: NumberInput) {
    this.set({ lineWidth: coerceNumberProperty(lineWidth) });
  }

  @Input() set resolution(resolution: NgtVector2) {
    this.set({ resolution });
  }

  readonly geometryProps$: Observable<{
    points: NgtSobaLineState['points'];
    vertexColors: NgtSobaLineState['vertexColors'];
  }> = this.select(
    this.select((s) => s.points),
    this.select((s) => s.vertexColors),
    (points, vertexColors) => ({ points, vertexColors }),
    { debounce: true }
  );

  readonly materialProps$: Observable<{
    vertexColors: boolean;
    resolution: NgtSobaLineState['resolution'];
    dashed: NgtSobaLineState['dashed'];
    color: THREE.Color;
    lineWidth: NgtSobaLineState['lineWidth'];
  }> = this.select(
    this.select((s) => s.vertexColors),
    this.select((s) => s.resolution),
    this.select((s) => s.dashed),
    this.select((s) => s.color),
    this.select((s) => s.lineWidth),
    (vertexColors, resolution, dashed, color, lineWidth) => ({
      vertexColors: vertexColors.length > 0,
      resolution,
      dashed,
      color,
      lineWidth,
    }),
    { debounce: true }
  );

  readonly #computeLineDistances = this.effect(
    pipe(
      observeOn(animationFrameScheduler),
      tap(() => {
        this.instanceValue.computeLineDistances();
      })
    )
  );

  override preInit() {
    super.preInit();
    this.set((s) => ({
      points: s.points ?? [],
      vertexColors: s.vertexColors ?? [],
      dashed: s.dashed ?? false,
      color: s.color ?? make(THREE.Color, 'black'),
      resolution: s.resolution ?? make(THREE.Vector2, [512, 512]),
    }));
    this.#computeLineDistances(
      this.select(
        this.instance.pipe(filter((value) => value !== null)),
        this.select((s) => s.points)
      )
    );
  }

  override destroy() {
    super.destroy();
    this.instanceValue.clear();
  }

  override instanceInitFn(): Line2 {
    return new Line2();
  }
}
