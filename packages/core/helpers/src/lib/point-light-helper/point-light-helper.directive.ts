// GENERATED

import { NgtHelper, NGT_OBJECT_CONTROLLER_PROVIDER } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-point-light-helper',
  exportAs: 'ngtPointLightHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtPointLightHelper,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtPointLightHelper extends NgtHelper<THREE.PointLightHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.PointLightHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.PointLightHelper>) {
    this.helperArgs = v;
  }

  helperType = THREE.PointLightHelper;
}

@NgModule({
  declarations: [NgtPointLightHelper],
  exports: [NgtPointLightHelper],
})
export class NgtPointLightHelperModule {}
