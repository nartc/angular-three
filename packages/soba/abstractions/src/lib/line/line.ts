import {
  injectNgtRef,
  injectNgtStore,
  NgtArgs,
  NgtRef,
  NgtRxStore,
  startWithUndefined,
} from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { Color, ColorRepresentation, Vector2, Vector3 } from 'three';
import { Line2, LineGeometry, LineMaterial } from 'three-stdlib';

@Component({
  selector: 'ngts-line[points]',
  standalone: true,
  template: `
    <ng-container *args="[lineRef.nativeElement]">
      <ngt-primitive *ref="lineRef" ngtCompound>
        <ngt-primitive *args="[get('lineGeometry')]" attach="geometry"></ngt-primitive>
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
        ></ngt-primitive>
      </ngt-primitive>
    </ng-container>
  `,
  imports: [NgtArgs, NgtRef],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsLine extends NgtRxStore implements OnInit {
  readonly Boolean = Boolean;
  readonly lineMaterial = new LineMaterial();

  readonly #store = injectNgtStore();

  @Input() lineRef = injectNgtRef<Line2>();

  @Input() set points(
    points: Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
  ) {
    this.set({ points });
  }

  @Input() set vertexColors(vertexColors: Array<Color | [number, number, number]>) {
    this.set({
      vertexColors: vertexColors === undefined ? this.get('vertexColors') : vertexColors,
    });
  }

  @Input() set lineWidth(lineWidth: number) {
    this.set({ lineWidth: lineWidth === undefined ? this.get('lineWidth') : lineWidth });
  }

  @Input() set alphaToCoverage(alphaToCoverage: boolean) {
    this.set({
      alphaToCoverage:
        alphaToCoverage === undefined ? this.get('alphaToCoverage') : alphaToCoverage,
    });
  }

  @Input() set color(color: ColorRepresentation) {
    this.set({ color: color === undefined ? this.get('color') : color });
  }

  @Input() set dashed(dashed: boolean) {
    this.set({ dashed: dashed === undefined ? this.get('dashed') : dashed });
  }

  @Input() set dashScale(dashScale: number) {
    this.set({ dashScale: dashScale === undefined ? this.get('dashScale') : dashScale });
  }

  @Input() set dashSize(dashSize: number) {
    this.set({ dashSize: dashSize === undefined ? this.get('dashSize') : dashSize });
  }

  @Input() set dashOffset(dashOffset: number) {
    this.set({ dashOffset: dashOffset === undefined ? this.get('dashOffset') : dashOffset });
  }

  @Input() set gapSize(gapSize: number) {
    this.set({ gapSize: gapSize === undefined ? this.get('gapSize') : gapSize });
  }

  @Input() set resolution(resolution: Vector2) {
    this.set({ resolution: resolution === undefined ? this.get('resolution') : resolution });
  }

  @Input() set wireframe(wireframe: boolean) {
    this.set({ wireframe: wireframe === undefined ? this.get('wireframe') : wireframe });
  }

  @Input() set worldUnits(worldUnits: boolean) {
    this.set({ worldUnits: worldUnits === undefined ? this.get('worldUnits') : worldUnits });
  }

  override initialize() {
    super.initialize();
    this.set({ color: 'black' });
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
    this.#setDash();
    this.#disposeGeometry();
  }

  #computeLineDistances() {
    this.hold(combineLatest([this.lineRef.$, this.select('points')]), ([line]) => {
      line.computeLineDistances();
    });
  }

  #setDash() {
    this.hold(this.select('dashed').pipe(startWithUndefined()), (dashed) => {
      if (dashed) {
        this.lineMaterial.defines['USE_DASH'] = '';
      } else {
        // Setting lineMaterial.defines.USE_DASH to undefined is apparently not sufficient.
        delete this.lineMaterial.defines['USE_DASH'];
      }
      this.lineMaterial.needsUpdate = true;
    });
  }

  #disposeGeometry() {
    this.effect(this.select('lineGeometry'), (lineGeometry: LineGeometry) => {
      return () => lineGeometry.dispose();
    });
  }
}
