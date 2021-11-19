// GENERATED

import { NgtLight, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-rect-area-light',
  exportAs: 'ngtRectAreaLight',
  providers: [
    {
      provide: NgtLight,
      useExisting: NgtRectAreaLight,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtRectAreaLight,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtRectAreaLight extends NgtLight<THREE.RectAreaLight> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.RectAreaLight> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.RectAreaLight>) {
    this.extraArgs = v;
  }

  lightType = THREE.RectAreaLight;
}
