// GENERATED
import { NgtGeometry } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { LineSegmentsGeometry  } from 'three/examples/jsm/lines/LineSegmentsGeometry';

@Directive({
  selector: 'ngt-line-segments-geometry',
  exportAs: 'ngtLineSegmentsGeometry',
  providers: [
    {
      provide: NgtGeometry,
      useExisting: NgtLineSegmentsGeometry,
    }
  ],
})
export class NgtLineSegmentsGeometry extends NgtGeometry<LineSegmentsGeometry> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof LineSegmentsGeometry> | undefined;

  @Input() set args(v: ConstructorParameters<typeof LineSegmentsGeometry>) {
    this.extraArgs = v;
  }

  geometryType = LineSegmentsGeometry;
}
