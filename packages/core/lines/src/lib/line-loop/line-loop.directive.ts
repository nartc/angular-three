import { ThreeLine, ThreeObject3d } from '@angular-three/core';
import { Directive } from '@angular/core';
import { LineLoop } from 'three';

@Directive({
  selector: 'ngt-lineLoop',
  exportAs: 'ngtLineLoop',
  providers: [{ provide: ThreeObject3d, useExisting: LineLoopDirective }],
})
export class LineLoopDirective extends ThreeLine<LineLoop> {
  lineType = LineLoop;
}
