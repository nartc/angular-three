// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-box-helper',
  exportAs: 'ngtBoxHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtBoxHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtBoxHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtBoxHelper extends NgtHelper<THREE.BoxHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.BoxHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.BoxHelper>) {
    this.extraArgs = v;
  }

  helperType = THREE.BoxHelper;
}
