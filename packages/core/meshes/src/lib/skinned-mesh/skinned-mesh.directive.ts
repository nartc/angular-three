import {
  OBJECT_3D_CONTROLLER_PROVIDER,
  ThreeMatrix4,
  ThreeMesh,
  ThreeObject3d,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { SkinnedMesh } from 'three';

@Directive({
  selector: 'ngt-skinned-mesh',
  exportAs: 'ngtSkinnedMesh',
  providers: [
    { provide: ThreeObject3d, useExisting: SkinnedMeshDirective },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class SkinnedMeshDirective extends ThreeMesh<SkinnedMesh> {
  @Input() set args(v: [boolean]) {
    this.extraArgs = v;
  }

  @Input() bindMatrix?: ThreeMatrix4;
  @Input() bindMode?: string;

  meshType = SkinnedMesh;
}
