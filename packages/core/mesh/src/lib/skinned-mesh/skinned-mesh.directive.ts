import {
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  NgtCommonMesh,
  NgtMatrix4,
  NgtObject3d,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-skinned-mesh',
  exportAs: 'ngtSkinnedMesh',
  providers: [
    { provide: NgtObject3d, useExisting: NgtSkinnedMesh },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtSkinnedMesh extends NgtCommonMesh<THREE.SkinnedMesh> {
  @Input() set args(v: [boolean]) {
    this.extraArgs = v;
  }

  @Input() bindMatrix?: NgtMatrix4;
  @Input() bindMode?: string;

  meshType = THREE.SkinnedMesh;
}
