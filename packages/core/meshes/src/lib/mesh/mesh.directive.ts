import { ThreeMesh, ThreeObject3d } from '@angular-three/core';
import { Directive } from '@angular/core';
import { Mesh } from 'three';

@Directive({
  selector: 'ngt-mesh',
  exportAs: 'ngtMesh',
  providers: [{ provide: ThreeObject3d, useExisting: MeshDirective }],
})
export class MeshDirective extends ThreeMesh {
  meshType = Mesh;
}
