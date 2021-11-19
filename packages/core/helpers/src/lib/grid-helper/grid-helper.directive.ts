// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-grid-helper',
  exportAs: 'ngtGridHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtGridHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtGridHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtGridHelper extends NgtHelper<THREE.GridHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.GridHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.GridHelper>) {
    this.extraArgs = v;
  }

  helperType = THREE.GridHelper;
}
