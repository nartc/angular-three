import {
  ArgFn,
  BodyShapeType,
  ParticleProps,
  GetByIndex,
  NgtPhysicBody,
} from '@angular-three/cannon';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ngtPhysicParticle]',
  exportAs: 'ngtPhysicParticle',
  providers: [{ provide: NgtPhysicBody, useExisting: NgtPhysicParticle }],
})
export class NgtPhysicParticle extends NgtPhysicBody<ParticleProps> {
  static ngAcceptInputType_getPropsByIndex:
    | GetByIndex<ParticleProps>
    | undefined;

  protected get type(): BodyShapeType {
    return 'Particle';
  }

  protected get argsFn(): ArgFn<ParticleProps['args']> {
    return () => [];
  }
}
