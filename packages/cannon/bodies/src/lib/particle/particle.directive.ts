// GENERATED
import {
  ParticleProps,
  GetByIndex,
  NGT_PHYSIC_BODY_ARGS_FN,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
} from '@angular-three/cannon';
import { Directive, NgModule } from '@angular/core';

@Directive({
  selector: '[ngtPhysicParticle]',
  exportAs: 'ngtPhysicParticle',
  providers: [
    NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_BODY_TYPE, useValue: 'Particle' },
    { provide: NGT_PHYSIC_BODY_ARGS_FN, useValue: () => [] },
  ],
})
export class NgtPhysicParticle {
  static ngAcceptInputType_getPhysicProps:
    | GetByIndex<ParticleProps>
    | undefined;
}

@NgModule({
  declarations: [NgtPhysicParticle],
  exports: [NgtPhysicParticle],
})
export class NgtPhysicParticleModule {}
