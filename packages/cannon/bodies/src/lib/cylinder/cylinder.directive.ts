// GENERATED
import {
  CylinderProps,
  GetByIndex,
  NGT_PHYSIC_BODY_ARGS_FN,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
} from '@angular-three/cannon';
import { Directive, NgModule } from '@angular/core';

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
}

@NgModule({
  declarations: [NgtPhysicCylinder],
  exports: [NgtPhysicCylinder],
})
export class NgtPhysicCylinderModule {}
