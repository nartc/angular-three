import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtCommonMesh,
  NgtObject3d,
} from '@angular-three/core';
import { Directive } from '@angular/core';
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2';

@Directive({
  selector: 'ngt-line-segments2',
  exportAs: 'ngtLineSegments2',
  providers: [
    { provide: NgtObject3d, useExisting: NgtLineSegments2 },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtLineSegments2 extends NgtCommonMesh<LineSegments2> {
  meshType = LineSegments2;
}
