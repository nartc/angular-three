import { ThreeObject3d } from '@angular-three/core';
import { ThreeLine } from '@angular-three/core/lines';
import { Directive } from '@angular/core';
import { LineSegments } from 'three';

@Directive({
  selector: 'ngt-lineSegments',
  exportAs: 'ngtLineSegments',
  providers: [
    { provide: ThreeObject3d, useExisting: LineSegmentsDirective, multi: true },
  ],
})
export class LineSegmentsDirective extends ThreeLine<LineSegments> {
  lineType = LineSegments;
}
