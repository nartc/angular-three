import { ThreeObject3d } from '@angular-three/core';
import { Directive } from '@angular/core';
import { DirectionalLight } from 'three';
import { ThreeLight } from '../abstracts';

@Directive({
  selector: 'ngt-directionalLight',
  exportAs: 'ngtDirectionalLight',
  providers: [
    { provide: ThreeObject3d, useExisting: DirectionalLightDirective },
  ],
})
export class DirectionalLightDirective extends ThreeLight<
  DirectionalLight,
  typeof DirectionalLight
> {
  static ngAcceptInputType_args: ConstructorParameters<typeof DirectionalLight>;

  lightType = DirectionalLight;
}
