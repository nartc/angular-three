// GENERATED
import {
  CylinderProps,
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
  selector: '[ngtPhysicCylinder]',
  exportAs: 'ngtPhysicCylinder',
  providers: [
    NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_BODY_TYPE, useValue: 'Cylinder' },
    {
      provide: NGT_PHYSIC_BODY_ARGS_FN,
      useValue: (args: CylinderProps['args'] = []) => args,
    },
  ],
})
export class NgtPhysicCylinder {
  static ngAcceptInputType_getPhysicProps:
    | GetByIndex<CylinderProps>
    | undefined;

  constructor(
    @Inject(NGT_PHYSIC_BODY_WATCHED_CONTROLLER)
    private physicBodyController: NgtPhysicBodyController
  ) {}

  get api() {
    return this.physicBodyController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicCylinder],
  exports: [NgtPhysicCylinder, NgtPhysicBodyControllerModule],
})
export class NgtPhysicCylinderModule {}
