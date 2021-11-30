// GENERATED

import { NgtHelper, NGT_OBJECT_CONTROLLER_PROVIDER } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-directional-light-helper',
  exportAs: 'ngtDirectionalLightHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtDirectionalLightHelper,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtDirectionalLightHelper extends NgtHelper<THREE.DirectionalLightHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.DirectionalLightHelper>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof THREE.DirectionalLightHelper>
  ) {
    this.helperArgs = v;
  }

  helperType = THREE.DirectionalLightHelper;
}

@NgModule({
  declarations: [NgtDirectionalLightHelper],
  exports: [NgtDirectionalLightHelper],
})
export class NgtDirectionalLightHelperModule {}
