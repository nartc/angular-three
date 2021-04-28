import {
  OBJECT_3D_CONTROLLER_PROVIDER,
  ThreeMesh,
  ThreeObject3d,
} from '@angular-three/core';
import { Directive } from '@angular/core';
import { Mesh } from 'three';

@Directive({
  selector: 'ngt-mesh',
  exportAs: 'ngtMesh',
  providers: [
    { provide: ThreeObject3d, useExisting: MeshDirective },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class MeshDirective extends ThreeMesh {
  meshType = Mesh;
}
