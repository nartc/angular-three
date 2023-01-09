import { injectNgtRef, startWithUndefined } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { QuadraticBezierCurve3, Vector3 } from 'three';
import { Line2 } from 'three-stdlib';
import { NgtsLine } from '../line/line';
import { NgtsLineInputs } from '../line/line-inputs';

const v = new Vector3();

@Component({
  selector: 'ngts-quadratic-bezier-line',
  standalone: true,
  template: `
    <ngts-line
      [lineRef]="lineRef"
      [points]="get('points')"
      [color]="get('color')"
      [vertexColors]="get('vertexColors')"
      [resolution]="get('resolution')"
      [lineWidth]="get('lineWidth')"
      [alphaToCoverage]="get('alphaToCoverage')"
      [dashed]="get('dashed')"
      [dashScale]="get('dashScale')"
      [dashSize]="get('dashSize')"
      [dashOffset]="get('dashOffset')"
      [gapSize]="get('gapSize')"
      [wireframe]="get('wireframe')"
      [worldUnits]="get('worldUnits')"
    ></ngts-line>
  `,
  imports: [NgtsLine],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsQuadraticBezierLine extends NgtsLineInputs implements OnInit {
  readonly curve = new QuadraticBezierCurve3(undefined!, undefined!, undefined!);

  @Input() lineRef = injectNgtRef<Line2>();

  @Input() set start(start: Vector3 | [number, number, number]) {
    this.set({ start: start === undefined ? this.get('start') : start });
  }

  @Input() set end(end: Vector3 | [number, number, number]) {
    this.set({ end: end === undefined ? this.get('end') : end });
  }

  @Input() set mid(mid: Vector3 | [number, number, number]) {
    this.set({ mid: mid === undefined ? this.get('mid') : mid });
  }

  @Input() set segments(segments: number) {
    this.set({ segments: segments === undefined ? this.get('segments') : segments });
  }

  override initialize(): void {
    super.initialize();
    this.set({ start: [0, 0, 0], end: [0, 0, 0], segments: 20 });
  }

  ngOnInit() {
    this.connect(
      'points',
      combineLatest([
        this.select('start'),
        this.select('end'),
        this.select('mid').pipe(startWithUndefined()),
        this.select('segments'),
      ]).pipe(
        map(([start, end, mid, segments]) => {
          return this.#getPoints(start, end, mid, segments);
        })
      )
    );

    this.#replaceSetPoints();
  }

  #replaceSetPoints() {
    this.hold(this.lineRef.$, (line) => {
      (
        line as unknown as {
          setPoints: (
            start: Vector3 | [number, number, number],
            end: Vector3 | [number, number, number],
            mid: Vector3 | [number, number, number]
          ) => void;
        }
      ).setPoints = (start, end, mid) => {
        const points = this.#getPoints(start, end, mid);
        if (this.lineRef.nativeElement.geometry) {
          this.lineRef.nativeElement.geometry.setPositions(points.map((p) => p.toArray()).flat());
        }
      };
    });
  }

  #getPoints(
    start: Vector3 | [number, number, number],
    end: Vector3 | [number, number, number],
    mid?: Vector3 | [number, number, number],
    segments = 20
  ) {
    if (start instanceof Vector3) this.curve.v0.copy(start);
    else this.curve.v0.set(...(start as [number, number, number]));
    if (end instanceof Vector3) this.curve.v2.copy(end);
    else this.curve.v2.set(...(end as [number, number, number]));
    if (mid instanceof Vector3) {
      this.curve.v1.copy(mid);
    } else {
      this.curve.v1.copy(
        this.curve.v0
          .clone()
          .add(this.curve.v2.clone().sub(this.curve.v0))
          .add(v.set(0, this.curve.v0.y - this.curve.v2.y, 0))
      );
    }
    return this.curve.getPoints(segments);
  }
}
