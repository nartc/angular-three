import { injectNgtRef, startWithUndefined } from '@angular-three/core';
import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { combineLatest, map } from 'rxjs';
import { CatmullRomCurve3, Color, Vector2, Vector3 } from 'three';
import { Line2 } from 'three-stdlib';
import { NgtsLine } from '../line/line';
import { NgtsLineInputs } from '../line/line-inputs';

@Component({
  selector: 'ngts-catmull-rom-line[points]',
  standalone: true,
  template: `
    <ngts-line
      [lineRef]="lineRef"
      [points]="get('segmentedPoints')"
      [color]="get('color')"
      [vertexColors]="get('interpolatedVertexColors')"
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
    />
  `,
  imports: [NgtsLine],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NgtsCatmullRomLine extends NgtsLineInputs {
  @Input() lineRef = injectNgtRef<Line2>();

  @Input() set points(
    points: Array<Vector3 | Vector2 | [number, number, number] | [number, number] | number>
  ) {
    this.set({ points });
  }

  @Input() set closed(closed: boolean) {
    this.set({ closed: closed === undefined ? this.get('closed') : closed });
  }

  @Input() set curveType(curveType: 'centripetal' | 'chordal' | 'catmullrom') {
    this.set({ curveType: curveType === undefined ? this.get('curveType') : curveType });
  }

  @Input() set tension(tension: number) {
    this.set({ tension: tension === undefined ? this.get('tension') : tension });
  }

  @Input() set segments(segments: number) {
    this.set({ segments: segments === undefined ? this.get('segments') : segments });
  }

  override initialize(): void {
    super.initialize();
    this.set({
      closed: false,
      curveType: 'centripetal',
      tension: 0.5,
      segments: 20,
    });
    this.connect(
      'curve',
      this.select(
        ['points', 'closed', 'curveType', 'tension'],
        ({ points, closed, curveType, tension }) => {
          const mappedPoints = points.map((pt: Vector3 | [number, number, number]) =>
            pt instanceof Vector3 ? pt : new Vector3(...pt)
          );
          return new CatmullRomCurve3(mappedPoints, closed, curveType, tension);
        }
      )
    );
    this.connect(
      'segmentedPoints',
      this.select(['curve', 'segments'], ({ curve, segments }) => curve.getPoints(segments))
    );
    this.connect(
      'interpolatedVertexColors',
      combineLatest([
        this.select('vertexColors').pipe(startWithUndefined()),
        this.select('segments'),
      ]).pipe(
        map(([vertexColors, segments]) => {
          if (!vertexColors || vertexColors.length < 2) return undefined;

          if (vertexColors.length === segments + 1) return vertexColors;

          const mappedColors = vertexColors.map((color: Color | [number, number, number]) =>
            color instanceof Color ? color : new Color(...color)
          );
          if (closed) mappedColors.push(mappedColors[0].clone());

          const iColors: Color[] = [mappedColors[0]];
          const divisions = segments / (mappedColors.length - 1);
          for (let i = 1; i < segments; i++) {
            const alpha = (i % divisions) / divisions;
            const colorIndex = Math.floor(i / divisions);
            iColors.push(
              mappedColors[colorIndex].clone().lerp(mappedColors[colorIndex + 1], alpha)
            );
          }
          iColors.push(mappedColors[mappedColors.length - 1]);

          return iColors;
        })
      )
    );
  }
}
