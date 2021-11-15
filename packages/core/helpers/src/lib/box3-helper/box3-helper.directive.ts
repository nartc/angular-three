// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-box3-helper',
  exportAs: 'ngtBox3Helper',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtBox3Helper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtBox3Helper extends NgtHelper<THREE.Box3Helper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Box3Helper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.Box3Helper>) {
    this.extraArgs = v;
  }

  helperType = THREE.Box3Helper;
}
