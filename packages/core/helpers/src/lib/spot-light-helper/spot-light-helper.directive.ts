// GENERATED

import { NgtHelper, NGT_OBJECT_CONTROLLER_PROVIDER } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-spot-light-helper',
  exportAs: 'ngtSpotLightHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtSpotLightHelper,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtSpotLightHelper extends NgtHelper<THREE.SpotLightHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.SpotLightHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.SpotLightHelper>) {
    this.helperArgs = v;
  }

  helperType = THREE.SpotLightHelper;
}

@NgModule({
  declarations: [NgtSpotLightHelper],
  exports: [NgtSpotLightHelper],
})
export class NgtSpotLightHelperModule {}
