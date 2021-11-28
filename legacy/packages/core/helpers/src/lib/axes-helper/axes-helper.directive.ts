// GENERATED

import { NgtHelper, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-axes-helper',
  exportAs: 'ngtAxesHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtAxesHelper,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtAxesHelper,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtAxesHelper extends NgtHelper<THREE.AxesHelper> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.AxesHelper> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.AxesHelper>) {
    this.extraArgs = v;
  }

  helperType = THREE.AxesHelper;
}

@NgModule({
  declarations: [NgtAxesHelper],
  exports: [NgtAxesHelper],
})
export class NgtAxesHelperModule {}

