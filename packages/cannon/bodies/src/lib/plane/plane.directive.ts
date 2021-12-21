// GENERATED
import {
  PlaneProps,
  GetByIndex,
  NGT_PHYSIC_BODY_ARGS_FN,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
  NGT_PHYSIC_BODY_WATCHED_CONTROLLER,
  NgtPhysicBodyController,
  NgtPhysicBodyControllerModule,
} from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';

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

  constructor(
    @Inject(NGT_PHYSIC_BODY_WATCHED_CONTROLLER)
    private physicBodyController: NgtPhysicBodyController
  ) {}

  get api() {
    return this.physicBodyController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicPlane],
  exports: [NgtPhysicPlane, NgtPhysicBodyControllerModule],
})
export class NgtPhysicPlaneModule {}
