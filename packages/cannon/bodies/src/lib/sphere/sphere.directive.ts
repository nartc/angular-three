// GENERATED
import {
  SphereProps,
  GetByIndex,
  NGT_PHYSIC_BODY_ARGS_FN,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
} from '@angular-three/cannon';
import { Directive, NgModule } from '@angular/core';

@Directive({
  selector: '[ngtPhysicSphere]',
  exportAs: 'ngtPhysicSphere',
  providers: [
    NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_BODY_TYPE, useValue: 'Sphere' },
    {
      provide: NGT_PHYSIC_BODY_ARGS_FN,
      useValue: (args: SphereProps['args'] = [1]) => {
        if (!Array.isArray(args))
          throw new Error('ngtPhysicSphere args must be an array');
        return [args[0]];
      },
    },
  ],
})
export class NgtPhysicSphere {
  static ngAcceptInputType_getPhysicProps: GetByIndex<SphereProps> | undefined;
}

@NgModule({
  declarations: [NgtPhysicSphere],
  exports: [NgtPhysicSphere],
})
export class NgtPhysicSphereModule {}
