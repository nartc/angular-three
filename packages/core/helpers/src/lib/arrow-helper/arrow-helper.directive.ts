// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { ArrowHelper } from 'three';
import { ThreeHelper } from '../abstracts';

@Directive({
  selector: 'ngt-arrowHelper',
  exportAs: 'ngtArrowHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: ArrowHelperDirective,
    },
  ],
})
export class ArrowHelperDirective extends ThreeHelper<ArrowHelper> {
  static ngAcceptInputType_args: ConstructorParameters<typeof ArrowHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof ArrowHelper>) {
    this.extraArgs = v;
  }

  helperType = ArrowHelper;
}
