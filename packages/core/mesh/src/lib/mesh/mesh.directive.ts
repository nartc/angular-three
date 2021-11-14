import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtCommonMesh,
  NgtObject3d,
} from '@angular-three/core';
import { Directive } from '@angular/core';
import { Mesh } from 'three';

@Directive({
  selector: 'ngt-mesh',
  exportAs: 'ngtMesh',
  providers: [
    { provide: NgtObject3d, useExisting: NgtMesh },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtMesh extends NgtCommonMesh {
  meshType = Mesh;
}
