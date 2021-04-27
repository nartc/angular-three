// GENERATED

import { ThreeLight, ThreeObject3d } from '@angular-three/core';
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
