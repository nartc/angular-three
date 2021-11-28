import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtCommonMesh,
  NgtObject3d,
} from '@angular-three/core';
import { Directive } from '@angular/core';
import { Line2 } from 'three/examples/jsm/lines/Line2';

@Directive({
  selector: 'ngt-line2',
  exportAs: 'ngtLine2',
  providers: [
    { provide: NgtObject3d, useExisting: NgtLine2 },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtLine2 extends NgtCommonMesh<Line2> {
  meshType = Line2;
}
