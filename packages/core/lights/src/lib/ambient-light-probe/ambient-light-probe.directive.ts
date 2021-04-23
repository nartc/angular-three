// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { AmbientLightProbe } from 'three';
import { ThreeLight } from '../abstracts';

@Directive({
  selector: 'ngt-ambientLightProbe',
  exportAs: 'ngtAmbientLightProbe',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: AmbientLightProbeDirective,
    },
  ],
})
export class AmbientLightProbeDirective extends ThreeLight<AmbientLightProbe> {
  static ngAcceptInputType_args: ConstructorParameters<typeof AmbientLightProbe> | undefined;

  @Input() set args(v: ConstructorParameters<typeof AmbientLightProbe>) {
    this.extraArgs = v;
  }

  lightType = AmbientLightProbe;
}
