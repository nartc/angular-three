// GENERATED
import {
  NgtHelper,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-box3-helper',
  exportAs: 'ngtBox3Helper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtBox3Helper,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtBox3Helper extends NgtHelper<THREE.Box3Helper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.Box3Helper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.Box3Helper>) {
    this.helperArgs = v;
  }

  helperType = THREE.Box3Helper;
}

@NgModule({
  declarations: [NgtBox3Helper],
  exports: [NgtBox3Helper, NgtObject3dControllerModule],
})
export class NgtBox3HelperModule {}
