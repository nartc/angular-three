// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-directional-light-helper',
  exportAs: 'ngtDirectionalLightHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtDirectionalLightHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtDirectionalLightHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtDirectionalLightHelper extends NgtHelper<THREE.DirectionalLightHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.DirectionalLightHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.DirectionalLightHelper>) {
    this.extraArgs = v;
  }

  helperType = THREE.DirectionalLightHelper;
}
