// GENERATED
import {
  HeightfieldProps,
  GetByIndex,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
  NGT_PHYSIC_BODY_WATCHED_CONTROLLER,
  NgtPhysicBodyController,
  NgtPhysicBodyControllerModule,
} from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';

@Directive({
  selector: '[ngtPhysicHeightfield]',
  exportAs: 'ngtPhysicHeightfield',
  providers: [
    NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_BODY_TYPE, useValue: 'Heightfield' },
  ],
})
export class NgtPhysicHeightfield {
  static ngAcceptInputType_getPhysicProps:
    | GetByIndex<HeightfieldProps>
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
  declarations: [NgtPhysicHeightfield],
  exports: [NgtPhysicHeightfield, NgtPhysicBodyControllerModule],
})
export class NgtPhysicHeightfieldModule {}
