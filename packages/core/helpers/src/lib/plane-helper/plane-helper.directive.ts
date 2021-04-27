// GENERATED

import { ThreeHelper, ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { PlaneHelper } from 'three';

@Directive({
  selector: 'ngt-plane-helper',
  exportAs: 'ngtPlaneHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: PlaneHelperDirective,
    },
  ],
})
export class PlaneHelperDirective extends ThreeHelper<PlaneHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof PlaneHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof PlaneHelper>) {
    this.extraArgs = v;
  }

  helperType = PlaneHelper;
}
