// GENERATED
import {
  PlaneProps,
  GetByIndex,
  NGT_PHYSIC_BODY_ARGS_FN,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
} from '@angular-three/cannon';
import { Directive, NgModule } from '@angular/core';

@Directive({
  selector: '[ngtPhysicPlane]',
  exportAs: 'ngtPhysicPlane',
  providers: [
    NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_BODY_TYPE, useValue: 'Plane' },
    { provide: NGT_PHYSIC_BODY_ARGS_FN, useValue: () => [] },
  ],
})
export class NgtPhysicPlane {
  static ngAcceptInputType_getPhysicProps: GetByIndex<PlaneProps> | undefined;
}

@NgModule({
  declarations: [NgtPhysicPlane],
  exports: [NgtPhysicPlane],
})
export class NgtPhysicPlaneModule {}
