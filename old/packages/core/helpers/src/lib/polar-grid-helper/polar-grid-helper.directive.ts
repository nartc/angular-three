// GENERATED
import {
  NgtHelper,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-polar-grid-helper',
  exportAs: 'ngtPolarGridHelper',
  providers: [
    {
      provide: NgtHelper,
      useExisting: NgtPolarGridHelper,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtPolarGridHelper extends NgtHelper<THREE.PolarGridHelper> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.PolarGridHelper>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.PolarGridHelper>) {
    this.helperArgs = v;
  }

  helperType = THREE.PolarGridHelper;
}

@NgModule({
  declarations: [NgtPolarGridHelper],
  exports: [NgtPolarGridHelper, NgtObject3dControllerModule],
})
export class NgtPolarGridHelperModule {}
