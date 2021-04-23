// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { SpotLightHelper } from 'three';
import { ThreeHelper } from '../abstracts';

@Directive({
  selector: 'ngt-spotLightHelper',
  exportAs: 'ngtSpotLightHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: SpotLightHelperDirective,
    },
  ],
})
export class SpotLightHelperDirective extends ThreeHelper<SpotLightHelper> {
  static ngAcceptInputType_args: ConstructorParameters<typeof SpotLightHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof SpotLightHelper>) {
    this.extraArgs = v;
  }

  helperType = SpotLightHelper;
}
