import {
  coerceBoolean,
  coerceNumber,
  make,
  NgtBooleanInput,
  NgtNumberInput,
  NgtObject,
  NgtObjectInputsState,
  NgtObjectPassThrough,
  NgtObservableInput,
  NgtTriple,
  NgtVector2,
  provideNgtObject,
  provideObjectHostRef,
  provideObjectRef,
  skipFirstUndefined,
} from '@angular-three/core';
import { NgtMesh } from '@angular-three/core/objects';
import { AsyncPipe, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { animationFrameScheduler, Observable, observeOn, tap } from 'rxjs';
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
    <ngt-mesh skipInit shouldPassThroughRef [ngtObjectPassThrough]="this">
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
  imports: [NgtMesh, NgtObjectPassThrough, NgtSobaLineGeometry, NgtSobaLineMaterial, NgIf, AsyncPipe],
  providers: [provideNgtObject(NgtSobaLine), provideObjectRef(NgtSobaLine), provideObjectHostRef(NgtSobaLine)],
})
export class NgtSobaLine extends NgtObject<Line2, NgtSobaLineState> {
  @Input() set points(points: NgtObservableInput<Array<THREE.Vector3 | NgtTriple>>) {
    this.set({ points, pointsExplicit: true });
  }

  @Input() set vertexColors(vertexColors: Array<THREE.Color | NgtTriple>) {
    this.set({ vertexColors, vertexColorsExplicit: true });
  }

  @Input() set dashed(dashed: NgtBooleanInput) {
    this.set({ dashed: coerceBoolean(dashed), dashedExplicit: true });
  }

  @Input() set lineWidth(lineWidth: NgtNumberInput) {
    this.set({ lineWidth: coerceNumber(lineWidth), lineWidthExplicit: true });
  }

  @Input() set resolution(resolution: NgtVector2) {
    this.set({ resolution, resolutionExplicit: true });
  }

  readonly geometryProps$: Observable<{
    points: NgtSobaLineState['points'];
    vertexColors: NgtSobaLineState['vertexColors'];
  }> = this.select(
    this.select((s) => s.points),
    this.select((s) => s.vertexColors).pipe(skipFirstUndefined()),
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
    this.select((s) => s.vertexColors).pipe(skipFirstUndefined()),
    this.select((s) => s.resolution).pipe(skipFirstUndefined()),
    this.select((s) => s.dashed).pipe(skipFirstUndefined()),
    this.select((s) => s.color).pipe(skipFirstUndefined()),
    this.select((s) => s.lineWidth).pipe(skipFirstUndefined()),
    (vertexColors, resolution, dashed, color, lineWidth) => ({
      vertexColors: vertexColors.length > 0,
      resolution,
      dashed,
      color,
      lineWidth,
    }),
    { debounce: true }
  );

  private readonly computeLineDistances = this.effect(
    tap(() => {
      this.instanceValue.computeLineDistances();
    })
  );

  override initialize() {
    super.initialize();
    this.set({
      points: [],
      vertexColors: [],
      dashed: false,
      color: make(THREE.Color, 'black'),
      resolution: make(THREE.Vector2, [512, 512]),
    });
  }

  override postInit() {
    super.postInit();
    this.computeLineDistances(
      this.select(
        this.instanceRef,
        this.select((s) => s.points),
        this.defaultProjector,
        { debounce: true }
      ).pipe(observeOn(animationFrameScheduler))
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
