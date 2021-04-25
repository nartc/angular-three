// GENERATED

import { ThreeHelper, ThreeObject3d } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { HemisphereLightHelper } from 'three';

@Directive({
  selector: 'ngt-hemisphereLightHelper',
  exportAs: 'ngtHemisphereLightHelper',
  providers: [
    {
      provide: ThreeObject3d,
      useExisting: HemisphereLightHelperDirective,
    },
  ],
})
export class HemisphereLightHelperDirective extends ThreeHelper<HemisphereLightHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof HemisphereLightHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof HemisphereLightHelper>) {
    this.extraArgs = v;
  }

  helperType = HemisphereLightHelper;
}
