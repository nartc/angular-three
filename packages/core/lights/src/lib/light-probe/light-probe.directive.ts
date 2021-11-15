// GENERATED

import {
  NgtLight,
  NgtObject3d,
  NGT_OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-light-probe',
  exportAs: 'ngtLightProbe',
  providers: [
    {
      provide: NgtObject3d,
      useExisting: NgtLightProbe,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtLightProbe extends NgtLight<THREE.LightProbe> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.LightProbe>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.LightProbe>) {
    this.extraArgs = v;
  }

  lightType = THREE.LightProbe;
}
