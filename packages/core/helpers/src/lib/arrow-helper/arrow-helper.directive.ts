// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-arrow-helper',
  exportAs: 'ngtArrowHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtArrowHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtArrowHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtArrowHelper extends NgtHelper<THREE.ArrowHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.ArrowHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.ArrowHelper>) {
    this.extraArgs = v;
  }

  helperType = THREE.ArrowHelper;
}
