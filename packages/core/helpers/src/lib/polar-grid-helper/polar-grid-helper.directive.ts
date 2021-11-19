// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-polar-grid-helper',
  exportAs: 'ngtPolarGridHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtPolarGridHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtPolarGridHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtPolarGridHelper extends NgtHelper<THREE.PolarGridHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PolarGridHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.PolarGridHelper>) {
    this.extraArgs = v;
  }

  helperType = THREE.PolarGridHelper;
}
