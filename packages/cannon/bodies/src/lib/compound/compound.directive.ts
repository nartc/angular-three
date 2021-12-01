// GENERATED
import {
  CompoundBodyProps,
  GetByIndex,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
} from '@angular-three/cannon';
import { Directive, NgModule } from '@angular/core';

@Directive({
  selector: '[ngtPhysicCompound]',
  exportAs: 'ngtPhysicCompound',
  providers: [
    NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_BODY_TYPE, useValue: 'Compound' },
  ],
})
export class NgtPhysicCompound {
  static ngAcceptInputType_getPhysicProps:
    | GetByIndex<CompoundBodyProps>
    | undefined;
}

@NgModule({
  declarations: [NgtPhysicCompound],
  exports: [NgtPhysicCompound],
})
export class NgtPhysicCompoundModule {}
