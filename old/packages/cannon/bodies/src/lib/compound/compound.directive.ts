// GENERATED
import {
  CompoundBodyProps,
  GetByIndex,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
  NGT_PHYSIC_BODY_WATCHED_CONTROLLER,
  NgtPhysicBodyController,
  NgtPhysicBodyControllerModule,
} from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';

@Directive({
  selector: '[ngtPhysicCompound]',
  exportAs: 'ngtPhysicCompound',
  providers: [
    NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_BODY_TYPE, useValue: 'Compound' },
  ],
})
export class NgtPhysicCompound {
  static ngAcceptInputType_getPhysicProps:
    | GetByIndex<CompoundBodyProps>
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
  declarations: [NgtPhysicCompound],
  exports: [NgtPhysicCompound, NgtPhysicBodyControllerModule],
})
export class NgtPhysicCompoundModule {}
