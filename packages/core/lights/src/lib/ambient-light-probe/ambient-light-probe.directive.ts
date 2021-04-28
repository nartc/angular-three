// GENERATED

import {
  ThreeLight,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { AmbientLightProbe } from 'three';

@Directive({
  selector: 'ngt-ambient-light-probe',
  exportAs: 'ngtAmbientLightProbe',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: AmbientLightProbeDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class AmbientLightProbeDirective extends ThreeLight<AmbientLightProbe> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof AmbientLightProbe>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof AmbientLightProbe>) {
    this.extraArgs = v;
  }

  lightType = AmbientLightProbe;
}
