import { ThreeObject3d } from '@angular-three/core';
import { Directive } from '@angular/core';
import { PointLight } from 'three';
import { ThreeLight } from '../abstracts';

@Directive({
  selector: 'ngt-pointLight',
  exportAs: 'ngtPointLight',
  providers: [{ provide: ThreeObject3d, useExisting: PointLightDirective }]
})
export class PointLightDirective extends ThreeLight<PointLight, typeof PointLight> {
  static ngAcceptInputType_args: ConstructorParameters<typeof PointLight>;

  lightType = PointLight;
}
