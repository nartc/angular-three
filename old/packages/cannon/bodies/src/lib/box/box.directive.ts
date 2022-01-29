// GENERATED
import {
  BoxProps,
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

  constructor(
    @Inject(NGT_PHYSIC_BODY_WATCHED_CONTROLLER)
    private physicBodyController: NgtPhysicBodyController
  ) {}

  get api() {
    return this.physicBodyController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicBox],
  exports: [NgtPhysicBox, NgtPhysicBodyControllerModule],
})
export class NgtPhysicBoxModule {}
