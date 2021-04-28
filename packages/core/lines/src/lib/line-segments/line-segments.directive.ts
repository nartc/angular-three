// GENERATED

import {
  ThreeLine,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { LineSegments } from 'three';

@Directive({
  selector: 'ngt-line-segments',
  exportAs: 'ngtLineSegments',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: LineSegmentsDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class LineSegmentsDirective extends ThreeLine<LineSegments> {
  lineType = LineSegments;
}
