// GENERATED

import { ThreeLight, ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { AmbientLight } from 'three';

@Directive({
  selector: 'ngt-ambientLight',
  exportAs: 'ngtAmbientLight',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: AmbientLightDirective,
    },
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
