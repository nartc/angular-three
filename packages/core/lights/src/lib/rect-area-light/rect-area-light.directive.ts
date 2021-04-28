// GENERATED

import {
  ThreeLight,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { RectAreaLight } from 'three';

@Directive({
  selector: 'ngt-rect-area-light',
  exportAs: 'ngtRectAreaLight',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: RectAreaLightDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class RectAreaLightDirective extends ThreeLight<RectAreaLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof RectAreaLight>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof RectAreaLight>) {
    this.extraArgs = v;
  }

  lightType = RectAreaLight;
}
