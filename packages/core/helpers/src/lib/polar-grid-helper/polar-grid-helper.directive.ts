// GENERATED

import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { PolarGridHelper } from 'three';
import { ThreeHelper } from '../abstracts';

@Directive({
  selector: 'ngt-polarGridHelper',
  exportAs: 'ngtPolarGridHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: PolarGridHelperDirective,
    },
  ],
})
export class PolarGridHelperDirective extends ThreeHelper<PolarGridHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof PolarGridHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof PolarGridHelper>) {
    this.extraArgs = v;
  }

  helperType = PolarGridHelper;
}
