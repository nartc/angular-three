// GENERATED
import {
  TrimeshProps,
  GetByIndex,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
  NGT_PHYSIC_BODY_WATCHED_CONTROLLER,
  NgtPhysicBodyController,
  NgtPhysicBodyControllerModule,
} from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';

@Directive({
  selector: '[ngtPhysicTrimesh]',
  exportAs: 'ngtPhysicTrimesh',
  providers: [
    NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_BODY_TYPE, useValue: 'Trimesh' },
  ],
})
export class NgtPhysicTrimesh {
  static ngAcceptInputType_getPhysicProps: GetByIndex<TrimeshProps> | undefined;

  constructor(
    @Inject(NGT_PHYSIC_BODY_WATCHED_CONTROLLER)
    private physicBodyController: NgtPhysicBodyController
  ) {}

  get api() {
    return this.physicBodyController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicTrimesh],
  exports: [NgtPhysicTrimesh, NgtPhysicBodyControllerModule],
})
export class NgtPhysicTrimeshModule {}
