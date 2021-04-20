import { ThreeObject3d } from '@angular-three/core';
import { ThreeLine } from '@angular-three/core/lines';
import { Directive } from '@angular/core';
import { LineLoop } from 'three';

@Directive({
  selector: 'ngt-lineLoop',
  exportAs: 'ngtLineLoop',
  providers: [
    { provide: ThreeObject3d, useExisting: LineLoopDirective, multi: true },
  ],
})
export class LineLoopDirective extends ThreeLine<LineLoop> {
  lineType = LineLoop;
}
