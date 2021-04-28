// GENERATED

import {
  ThreeLight,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { SpotLight } from 'three';

@Directive({
  selector: 'ngt-spot-light',
  exportAs: 'ngtSpotLight',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: SpotLightDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
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
