// GENERATED

import {
  ThreeLine,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Line } from 'three';

@Directive({
  selector: 'ngt-line',
  exportAs: 'ngtLine',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: LineDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class LineDirective extends ThreeLine<Line> {
  lineType = Line;
}
