// GENERATED
import {
  ConvexPolyhedronProps,
  GetByIndex,
  NGT_PHYSIC_BODY_ARGS_FN,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
  NGT_PHYSIC_BODY_WATCHED_CONTROLLER,
  NgtPhysicBodyController,
  NgtPhysicBodyControllerModule,
  makeTriplet,
} from '@angular-three/cannon';
import { Directive, Inject, NgModule } from '@angular/core';

@Directive({
  selector: '[ngtPhysicConvexPolyhedron]',
  exportAs: 'ngtPhysicConvexPolyhedron',
  providers: [
    NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_BODY_TYPE, useValue: 'ConvexPolyhedron' },
    {
      provide: NGT_PHYSIC_BODY_ARGS_FN,
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
    @Inject(NGT_PHYSIC_BODY_WATCHED_CONTROLLER)
    private physicBodyController: NgtPhysicBodyController
  ) {}

  get api() {
    return this.physicBodyController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicConvexPolyhedron],
  exports: [NgtPhysicConvexPolyhedron, NgtPhysicBodyControllerModule],
})
export class NgtPhysicConvexPolyhedronModule {}
