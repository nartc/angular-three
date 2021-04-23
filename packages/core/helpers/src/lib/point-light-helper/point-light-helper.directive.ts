// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { PointLightHelper } from 'three';
import { ThreeHelper } from '../abstracts';

@Directive({
  selector: 'ngt-pointLightHelper',
  exportAs: 'ngtPointLightHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: PointLightHelperDirective,
    },
  ],
})
export class PointLightHelperDirective extends ThreeHelper<PointLightHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof PointLightHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof PointLightHelper>) {
    this.extraArgs = v;
  }

  helperType = PointLightHelper;
}
