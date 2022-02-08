// GENERATED
import { TrimeshProps, GetByIndex } from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';
import {
  NGT_CANNON_BODY_CONTROLLER_PROVIDER,
  NGT_CANNON_BODY_TYPE,
  NGT_CANNON_BODY_WATCHED_CONTROLLER,
  NgtCannonBodyController,
  NgtCannonBodyControllerModule,
} from '../body.controller';

@Directive({
  selector: '[ngtPhysicTrimesh]',
  exportAs: 'ngtPhysicTrimesh',
  providers: [
    NGT_CANNON_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_CANNON_BODY_TYPE, useValue: 'Trimesh' },
  ],
})
export class NgtPhysicTrimesh {
  static ngAcceptInputType_getPhysicProps: GetByIndex<TrimeshProps> | undefined;

  constructor(
    @Inject(NGT_CANNON_BODY_WATCHED_CONTROLLER)
    private cannonBodyController: NgtCannonBodyController
  ) {}

  get api() {
    return this.cannonBodyController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicTrimesh],
  exports: [NgtPhysicTrimesh, NgtCannonBodyControllerModule],
})
export class NgtPhysicTrimeshModule {}
