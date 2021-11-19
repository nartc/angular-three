// GENERATED

import { NgtLight, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-hemisphere-light',
  exportAs: 'ngtHemisphereLight',
  providers: [
    {
      provide: NgtLight,
      useExisting: NgtHemisphereLight,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtHemisphereLight,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtHemisphereLight extends NgtLight<THREE.HemisphereLight> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.HemisphereLight> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.HemisphereLight>) {
    this.extraArgs = v;
  }

  lightType = THREE.HemisphereLight;
}
