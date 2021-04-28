// GENERATED

import {
  ThreeLight,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { HemisphereLightProbe } from 'three';

@Directive({
  selector: 'ngt-hemisphere-light-probe',
  exportAs: 'ngtHemisphereLightProbe',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: HemisphereLightProbeDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class HemisphereLightProbeDirective extends ThreeLight<HemisphereLightProbe> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof HemisphereLightProbe>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof HemisphereLightProbe>) {
    this.extraArgs = v;
  }

  lightType = HemisphereLightProbe;
}
