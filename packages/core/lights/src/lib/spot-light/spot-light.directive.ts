// GENERATED

import { NgtLight, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-spot-light',
  exportAs: 'ngtSpotLight',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtSpotLight,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtSpotLight extends NgtLight<THREE.SpotLight> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.SpotLight> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.SpotLight>) {
    this.extraArgs = v;
  }

  lightType = THREE.SpotLight;
}
