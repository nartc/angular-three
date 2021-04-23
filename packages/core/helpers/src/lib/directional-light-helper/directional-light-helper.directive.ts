// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { DirectionalLightHelper } from 'three';
import { ThreeHelper } from '../abstracts';

@Directive({
  selector: 'ngt-directionalLightHelper',
  exportAs: 'ngtDirectionalLightHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: DirectionalLightHelperDirective,
    },
  ],
})
export class DirectionalLightHelperDirective extends ThreeHelper<DirectionalLightHelper> {
  static ngAcceptInputType_args: ConstructorParameters<typeof DirectionalLightHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof DirectionalLightHelper>) {
    this.extraArgs = v;
  }

  helperType = DirectionalLightHelper;
}
