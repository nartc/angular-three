// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { BoxHelper } from 'three';
import { ThreeHelper } from '../abstracts';

@Directive({
  selector: 'ngt-boxHelper',
  exportAs: 'ngtBoxHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: BoxHelperDirective,
    },
  ],
})
export class BoxHelperDirective extends ThreeHelper<BoxHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof BoxHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof BoxHelper>) {
    this.extraArgs = v;
  }

  helperType = BoxHelper;
}
