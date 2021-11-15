// GENERATED

import {
  NgtLight,
  NgtObject3d,
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-ambient-light-probe',
  exportAs: 'ngtAmbientLightProbe',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtAmbientLightProbe,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtAmbientLightProbe extends NgtLight<THREE.AmbientLightProbe> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.AmbientLightProbe>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.AmbientLightProbe>) {
    this.extraArgs = v;
  }

  lightType = THREE.AmbientLightProbe;
}
