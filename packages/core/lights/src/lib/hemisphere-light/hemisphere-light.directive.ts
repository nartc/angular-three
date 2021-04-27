// GENERATED

import { ThreeLight, ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { HemisphereLight } from 'three';

@Directive({
  selector: 'ngt-hemisphere-light',
  exportAs: 'ngtHemisphereLight',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: HemisphereLightDirective,
    },
  ],
})
export class HemisphereLightDirective extends ThreeLight<HemisphereLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof HemisphereLight>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof HemisphereLight>) {
    this.extraArgs = v;
  }

  lightType = HemisphereLight;
}
