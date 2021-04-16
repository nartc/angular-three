import { ThreeObject3d } from '@angular-three/core';
import type { UniqueMeshArgs } from '@angular-three/core/typings';
import { Directive } from '@angular/core';
import { Mesh } from 'three';
import { ThreeMesh } from '../abstracts';

@Directive({
  selector: 'ngt-mesh',
  exportAs: 'ngtMesh',
  providers: [{ provide: ThreeObject3d, useExisting: MeshDirective }],
})
export class MeshDirective extends ThreeMesh {
  static ngAcceptInputType_args: UniqueMeshArgs<typeof Mesh>;

  meshType = Mesh;
}
