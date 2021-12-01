import { Directive, NgModule } from '@angular/core';
import { NgtPhysicsStore } from './physics.store';

@Directive({
  selector: 'ngt-physics',
  exportAs: 'ngtPhysics',
  providers: [NgtPhysicsStore]
})
export class NgtPhysics {
}

@NgModule({
  declarations: [NgtPhysics],
  exports: [NgtPhysics]
})
export class NgtPhysicsModule {
}
