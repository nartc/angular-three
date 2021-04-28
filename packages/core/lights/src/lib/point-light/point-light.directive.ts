// GENERATED

import {
  ThreeLight,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { PointLight } from 'three';

@Directive({
  selector: 'ngt-point-light',
  exportAs: 'ngtPointLight',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: PointLightDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class PointLightDirective extends ThreeLight<PointLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof PointLight>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof PointLight>) {
    this.extraArgs = v;
  }

  lightType = PointLight;
}
