// GENERATED

import { NgtCommonCamera, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-perspective-camera',
  exportAs: 'ngtPerspectiveCamera',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtPerspectiveCamera,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtPerspectiveCamera extends NgtCommonCamera<THREE.PerspectiveCamera> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PerspectiveCamera> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.PerspectiveCamera>) {
    this.extraArgs = v;
  }

  cameraType = THREE.PerspectiveCamera;
}
