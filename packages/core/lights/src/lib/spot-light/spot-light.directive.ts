// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { SpotLight } from 'three';
import { ThreeLight } from '../abstracts';

@Directive({
  selector: 'ngt-spotLight',
  exportAs: 'ngtSpotLight',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: SpotLightDirective,
    },
  ],
})
export class SpotLightDirective extends ThreeLight<SpotLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof SpotLight>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof SpotLight>) {
    this.extraArgs = v;
  }

  lightType = SpotLight;
}
