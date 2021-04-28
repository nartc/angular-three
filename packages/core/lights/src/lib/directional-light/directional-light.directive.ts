// GENERATED

import {
  ThreeLight,
  ThreeObject3d,
  OBJECT_3D_CONTROLLER_PROVIDER,
} from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { DirectionalLight } from 'three';

@Directive({
  selector: 'ngt-directional-light',
  exportAs: 'ngtDirectionalLight',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: DirectionalLightDirective,
    },
    OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class DirectionalLightDirective extends ThreeLight<DirectionalLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof DirectionalLight>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof DirectionalLight>) {
    this.extraArgs = v;
  }

  lightType = DirectionalLight;
}
