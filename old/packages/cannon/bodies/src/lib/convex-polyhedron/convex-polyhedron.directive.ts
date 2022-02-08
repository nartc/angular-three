// GENERATED
import { ConvexPolyhedronProps, GetByIndex } from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';
import {
  NGT_CANNON_BODY_ARGS_FN,
  NGT_CANNON_BODY_CONTROLLER_PROVIDER,
  NGT_CANNON_BODY_TYPE,
  NGT_CANNON_BODY_WATCHED_CONTROLLER,
  NgtCannonBodyController,
  NgtCannonBodyControllerModule,
} from '../body.controller';
import { makeTriplet } from '../utils';

@Directive({
  selector: '[ngtPhysicConvexPolyhedron]',
  exportAs: 'ngtPhysicConvexPolyhedron',
  providers: [
    NGT_CANNON_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_CANNON_BODY_TYPE, useValue: 'ConvexPolyhedron' },
    {
      provide: NGT_CANNON_BODY_ARGS_FN,
      useValue: (args: ConvexPolyhedronProps['args'] = []) => {
        return [
          args[0] ? args[0].map(makeTriplet) : undefined,
          args[1],
          args[2] ? args[2].map(makeTriplet) : undefined,
          args[3] ? args[3].map(makeTriplet) : undefined,
          args[4],
        ];
      },
    },
  ],
})
export class NgtPhysicConvexPolyhedron {
  static ngAcceptInputType_getPhysicProps:
    | GetByIndex<ConvexPolyhedronProps>
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
  declarations: [NgtPhysicConvexPolyhedron],
  exports: [NgtPhysicConvexPolyhedron, NgtCannonBodyControllerModule],
})
export class NgtPhysicConvexPolyhedronModule {}
