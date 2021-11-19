// GENERATED

import { NgtCommonCamera, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-array-camera',
  exportAs: 'ngtArrayCamera',
  providers: [
    {
      provide: NgtCommonCamera,
      useExisting: NgtArrayCamera,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtArrayCamera,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtArrayCamera extends NgtCommonCamera<THREE.ArrayCamera> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.ArrayCamera> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.ArrayCamera>) {
    this.extraArgs = v;
  }

  cameraType = THREE.ArrayCamera;
}
