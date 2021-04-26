import { ThreeLine, ThreeObject3d } from '@angular-three/core';
import { Directive } from '@angular/core';
import { Line } from 'three';

@Directive({
  selector: 'ngt-line',
  exportAs: 'ngtLine',
  providers: [{ provide: ThreeObject3d, useExisting: LineDirective }],
})
export class LineDirective extends ThreeLine {
  lineType = Line;
}
