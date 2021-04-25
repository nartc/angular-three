// GENERATED

import { ThreeLight, ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { LightProbe } from 'three';

@Directive({
  selector: 'ngt-lightProbe',
  exportAs: 'ngtLightProbe',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: LightProbeDirective,
    },
  ],
})
export class LightProbeDirective extends ThreeLight<LightProbe> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof LightProbe>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof LightProbe>) {
    this.extraArgs = v;
  }

  lightType = LightProbe;
}
