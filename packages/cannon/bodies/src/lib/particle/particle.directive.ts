// GENERATED
import {
  ParticleProps,
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

  constructor(
    @Inject(NGT_PHYSIC_BODY_WATCHED_CONTROLLER)
    private physicBodyController: NgtPhysicBodyController
  ) {}

  get api() {
    return this.physicBodyController.api;
  }
}

@NgModule({
  declarations: [NgtPhysicParticle],
  exports: [NgtPhysicParticle, NgtPhysicBodyControllerModule],
})
export class NgtPhysicParticleModule {}
