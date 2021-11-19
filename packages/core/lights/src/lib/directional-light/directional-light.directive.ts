// GENERATED

import { NgtLight, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-directional-light',
  exportAs: 'ngtDirectionalLight',
  providers: [
    {
      provide: NgtLight,
      useExisting: NgtDirectionalLight,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtDirectionalLight,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtDirectionalLight extends NgtLight<THREE.DirectionalLight> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.DirectionalLight> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.DirectionalLight>) {
    this.extraArgs = v;
  }

  lightType = THREE.DirectionalLight;
}
