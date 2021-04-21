import { ThreeObject3d } from '@angular-three/core';
import { Directive } from '@angular/core';
import { LineSegments } from 'three';
import { ThreeLine } from '../abstracts';

@Directive({
  selector: 'ngt-lineSegments',
  exportAs: 'ngtLineSegments',
  providers: [{ provide: ThreeObject3d, useExisting: LineSegmentsDirective }],
})
export class LineSegmentsDirective extends ThreeLine<LineSegments> {
  lineType = LineSegments;
}
