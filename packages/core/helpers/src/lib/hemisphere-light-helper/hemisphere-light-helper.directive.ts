// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-hemisphere-light-helper',
  exportAs: 'ngtHemisphereLightHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtHemisphereLightHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtHemisphereLightHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtHemisphereLightHelper extends NgtHelper<THREE.HemisphereLightHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.HemisphereLightHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.HemisphereLightHelper>) {
    this.extraArgs = v;
  }

  helperType = THREE.HemisphereLightHelper;
}
