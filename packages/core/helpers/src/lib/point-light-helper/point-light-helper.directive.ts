// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-point-light-helper',
  exportAs: 'ngtPointLightHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtPointLightHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtPointLightHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtPointLightHelper extends NgtHelper<THREE.PointLightHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PointLightHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.PointLightHelper>) {
    this.extraArgs = v;
  }

  helperType = THREE.PointLightHelper;
}
