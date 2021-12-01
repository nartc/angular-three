// GENERATED
import {
  BoxProps,
  GetByIndex,
  NGT_PHYSIC_BODY_ARGS_FN,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
} from '@angular-three/cannon';
import { Directive, NgModule } from '@angular/core';

@Directive({
  selector: '[ngtPhysicBox]',
  exportAs: 'ngtPhysicBox',
  providers: [
    NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_BODY_TYPE, useValue: 'Box' },
    {
      provide: NGT_PHYSIC_BODY_ARGS_FN,
      useValue: (args: BoxProps['args'] = [1, 1, 1]) => args,
    },
  ],
})
export class NgtPhysicBox {
  static ngAcceptInputType_getPhysicProps: GetByIndex<BoxProps> | undefined;
}

@NgModule({
  declarations: [NgtPhysicBox],
  exports: [NgtPhysicBox],
})
export class NgtPhysicBoxModule {}
