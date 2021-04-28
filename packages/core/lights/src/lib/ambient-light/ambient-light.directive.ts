// GENERATED

import {
  ThreeLight,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { AmbientLight } from 'three';

@Directive({
  selector: 'ngt-ambient-light',
  exportAs: 'ngtAmbientLight',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: AmbientLightDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class AmbientLightDirective extends ThreeLight<AmbientLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof AmbientLight>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof AmbientLight>) {
    this.extraArgs = v;
  }

  lightType = AmbientLight;
}
