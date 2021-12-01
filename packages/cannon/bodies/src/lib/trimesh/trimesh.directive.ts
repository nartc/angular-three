// GENERATED
import {
  TrimeshProps,
  GetByIndex,
  NGT_PHYSIC_BODY_CONTROLLER_PROVIDER,
  NGT_PHYSIC_BODY_TYPE,
} from '@angular-three/cannon';
import { Directive, NgModule } from '@angular/core';

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
}

@NgModule({
  declarations: [NgtPhysicTrimesh],
  exports: [NgtPhysicTrimesh],
})
export class NgtPhysicTrimeshModule {}
