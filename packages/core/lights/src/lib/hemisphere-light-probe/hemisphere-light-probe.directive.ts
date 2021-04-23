// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { HemisphereLightProbe } from 'three';
import { ThreeLight } from '../abstracts';

@Directive({
  selector: 'ngt-hemisphereLightProbe',
  exportAs: 'ngtHemisphereLightProbe',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: HemisphereLightProbeDirective,
    },
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
