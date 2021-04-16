import { ThreeObject3d } from '@angular-three/core';
import { Directive } from '@angular/core';
import { AmbientLight } from 'three';
import { ThreeLight } from '../abstracts';

@Directive({
  selector: 'ngt-ambientLight',
  exportAs: 'ngtAmbientLight',
  providers: [{ provide: ThreeObject3d, useExisting: AmbientLightDirective }],
})
export class AmbientLightDirective extends ThreeLight<
  AmbientLight,
  typeof AmbientLight
> {
  static ngAcceptInputType_args: ConstructorParameters<typeof AmbientLight>;

  lightType = AmbientLight;
}
