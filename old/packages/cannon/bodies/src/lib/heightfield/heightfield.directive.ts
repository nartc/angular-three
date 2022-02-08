// GENERATED
import { HeightfieldProps, GetByIndex } from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';
import {
  NGT_CANNON_BODY_CONTROLLER_PROVIDER,
  NGT_CANNON_BODY_TYPE,
  NGT_CANNON_BODY_WATCHED_CONTROLLER,
  NgtCannonBodyController,
  NgtCannonBodyControllerModule,
} from '../body.controller';

@Directive({
  selector: '[ngtPhysicHeightfield]',
  exportAs: 'ngtPhysicHeightfield',
  providers: [
    NGT_CANNON_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_CANNON_BODY_TYPE, useValue: 'Heightfield' },
  ],
})
export class NgtPhysicHeightfield {
  static ngAcceptInputType_getPhysicProps:
    | GetByIndex<HeightfieldProps>
    | undefined;

  constructor(
    @Inject(NGT_CANNON_BODY_WATCHED_CONTROLLER)
    private cannonBodyController: NgtCannonBodyController
  ) {}

  get api() {
    return this.cannonBodyController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicHeightfield],
  exports: [NgtPhysicHeightfield, NgtCannonBodyControllerModule],
})
export class NgtPhysicHeightfieldModule {}
