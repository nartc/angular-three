// GENERATED

import { NgtPass } from '@angular-three/postprocessing';
import { Directive, Input } from '@angular/core';
import { ClearPass } from 'three/examples/jsm/postprocessing/ClearPass';

@Directive({
  selector: 'ngt-clear-pass',
  exportAs: 'ngtClearPass',
  providers: [{ provide: NgtPass, useExisting: NgtClearPass }],
})
export class NgtClearPass extends NgtPass<ClearPass> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof ClearPass>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof ClearPass>) {
    this.extraArgs = v;
  }
  

  passType = ClearPass;
}
