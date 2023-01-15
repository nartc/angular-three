import {
  injectNgtRef,
  injectNgtStore,
  NgtAfterAttach,
  NgtArgs,
  startWithUndefined,
} from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { Color, Vector2, Vector3 } from 'three';
import { Line2, LineGeometry, LineMaterial } from 'three-stdlib';
import { NgtsLineInputs } from './line-inputs';

@Component({
  selector: 'ngts-line[points]',
  standalone: true,
  template: `
    <ngt-primitive *args="[lineRef.nativeElement]" [ref]="lineRef" ngtCompound>
      <ngt-primitive
        *args="[get('lineGeometry')]"
        attach="geometry"
        (afterAttach)="onAfterAttach($any($event))"
      />
      <ngt-primitive
        *args="[lineMaterial]"
        attach="material"
        [color]="get('color')"
        [vertexColors]="Boolean(get('vertexColors'))"
        [resolution]="get('materialResolution')"
        [linewidth]="get('lineWidth')"
        [alphaToCoverage]="get('alphaToCoverage')"
        [dashed]="get('dashed')"
        [dashScale]="get('dashScale')"
        [dashSize]="get('dashSize')"
        [dashOffset]="get('dashOffset')"
        [gapSize]="get('gapSize')"
        [wireframe]="get('wireframe')"
        [worldUnits]="get('worldUnits')"
      />
    </ngt-primitive>
  `,
  imports: [NgtArgs],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsLine extends NgtsLineInputs implements OnInit {
  readonly Boolean = Boolean;
  readonly lineMaterial = new LineMaterial();

  readonly #store = injectNgtStore();

  @Input() lineRef = injectNgtRef<Line2>();

  @Input() set points(
    points: Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
  ) {
    this.set({ points });
  }

  // TODO: Figure out if this is the case for everything else.
  // We'd want to run computeLineDistances on the Line2 on "points" changed
  // Consequently,when "points" changes, LineGeometry also changes and that causes
  // the Renderer to replace the LineGeometry on the Line2, which is what's happening.
  // But the effect that runs line.computeLineDistances() runs a little BEFORE the new lineGeometry
  // has been attached. So it doesn't work with the props changed from the Material
  //
  // Alternatively, we can also run the effect on line#children changes.
  onAfterAttach({ parent }: NgtAfterAttach<Line2, LineGeometry>) {
    parent.computeLineDistances();
  }

  override initialize() {
    super.initialize();
    this.connect(
      'lineGeometry',
      combineLatest([
        this.select('points'),
        this.select('vertexColors').pipe(startWithUndefined()),
      ]).pipe(
        map(([points, vertexColors]) => {
          const geometry = new LineGeometry();
          const pValues = (
            points as Array<
              Vector3 | Vector2 | [number, number, number] | [number, number] | number
            >
          ).map((p) => {
            const isArray = Array.isArray(p);
            return p instanceof Vector3
              ? [p.x, p.y, p.z]
              : p instanceof Vector2
              ? [p.x, p.y, 0]
              : isArray && p.length === 3
              ? [p[0], p[1], p[2]]
              : isArray && p.length === 2
              ? [p[0], p[1], 0]
              : p;
          });

          geometry.setPositions(pValues.flat());

          if (vertexColors) {
            const cValues = (vertexColors as Array<Color | [number, number, number]>).map((c) =>
              c instanceof Color ? c.toArray() : c
            );
            geometry.setColors(cValues.flat());
          }

          return geometry;
        })
      )
    );
  }

  ngOnInit() {
    this.connect(
      'materialResolution',
      combineLatest([
        this.#store.select('size'),
        this.select('resolution').pipe(startWithUndefined()),
      ]).pipe(map(([size, resolution]) => resolution ?? [size.width, size.height]))
    );
    if (!this.lineRef.nativeElement) this.lineRef.nativeElement = new Line2();
    this.#computeLineDistances();
    this.#disposeGeometry();
  }

  #computeLineDistances() {
    this.hold(
      combineLatest([this.lineRef.$, this.lineRef.children$('nonObjects'), this.select('points')]),
      ([line]) => {
        line.computeLineDistances();
      }
    );
  }

  #disposeGeometry() {
    this.effect(this.select('lineGeometry'), (lineGeometry: LineGeometry) => {
      return () => lineGeometry.dispose();
    });
  }
}
