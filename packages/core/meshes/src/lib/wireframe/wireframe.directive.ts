import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtCommonMesh,
  NgtObject3d,
} from '@angular-three/core';
import { Directive } from '@angular/core';
import { Wireframe } from 'three/examples/jsm/lines/Wireframe';

@Directive({
  selector: 'ngt-wireframe',
  exportAs: 'ngtWireframe',
  providers: [
    { provide: NgtObject3d, useExisting: NgtWireframe },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtWireframe extends NgtCommonMesh<Wireframe> {
  meshType = Wireframe;
}
