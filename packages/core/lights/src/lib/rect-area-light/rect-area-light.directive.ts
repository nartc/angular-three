// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { RectAreaLight } from 'three';
import { ThreeLight } from '../abstracts';

@Directive({
  selector: 'ngt-rectAreaLight',
  exportAs: 'ngtRectAreaLight',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: RectAreaLightDirective,
    },
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
