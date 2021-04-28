// GENERATED

import {
  ThreeLine,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { LineLoop } from 'three';

@Directive({
  selector: 'ngt-line-loop',
  exportAs: 'ngtLineLoop',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: LineLoopDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class LineLoopDirective extends ThreeLine<LineLoop> {
  lineType = LineLoop;
}
