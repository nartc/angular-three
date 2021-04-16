import { ThreeObject3d } from '@angular-three/core';
import { UniqueMeshArgs } from '@angular-three/core/typings';
import { Directive } from '@angular/core';
import { InstancedMesh } from 'three';
import { ThreeMesh } from '../abstracts';

@Directive({
  selector: 'ngt-instancedMesh',
  exportAs: 'ngtInstancedMesh',
  providers: [{ provide: ThreeObject3d, useExisting: InstancedMeshDirective }],
})
export class InstancedMeshDirective extends ThreeMesh<InstancedMesh> {
  static ngAcceptInputType_args: UniqueMeshArgs<typeof InstancedMesh>;

  meshType = InstancedMesh;
}
