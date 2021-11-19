// GENERATED

import { NgtLight, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-hemisphere-light-probe',
  exportAs: 'ngtHemisphereLightProbe',
  providers: [
    {
      provide: NgtLight,
      useExisting: NgtHemisphereLightProbe,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtHemisphereLightProbe,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtHemisphereLightProbe extends NgtLight<THREE.HemisphereLightProbe> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.HemisphereLightProbe> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.HemisphereLightProbe>) {
    this.extraArgs = v;
  }

  lightType = THREE.HemisphereLightProbe;
}
