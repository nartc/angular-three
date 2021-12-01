// GENERATED
import {
  HeightfieldProps,
  GetByIndex,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
} from '@angular-three/cannon';
import { Directive, NgModule } from '@angular/core';

@Directive({
  selector: '[ngtPhysicHeightfield]',
  exportAs: 'ngtPhysicHeightfield',
  providers: [
    NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
    { provide: NGT_PHYSIC_BODY_TYPE, useValue: 'Heightfield' },
  ],
})
export class NgtPhysicHeightfield {
  static ngAcceptInputType_getPhysicProps:
    | GetByIndex<HeightfieldProps>
    | undefined;
}

@NgModule({
  declarations: [NgtPhysicHeightfield],
  exports: [NgtPhysicHeightfield],
})
export class NgtPhysicHeightfieldModule {}
