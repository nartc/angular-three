// GENERATED
import {
  NgtHelper,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-grid-helper',
  exportAs: 'ngtGridHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtGridHelper,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtGridHelper extends NgtHelper<THREE.GridHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.GridHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.GridHelper>) {
    this.helperArgs = v;
  }

  helperType = THREE.GridHelper;
}

@NgModule({
  declarations: [NgtGridHelper],
  exports: [NgtGridHelper, NgtObject3dControllerModule],
})
export class NgtGridHelperModule {}
