import { NgtTriplet } from '@angular-three/core';
import { Directive, Input, NgModule, NgZone } from '@angular/core';
import { NgtPhysicBodyControllerModule } from './body/body.controller';
import { NgtPhysicConstraintControllerModule } from './constraint/constraint.controller';
import { NgtCannonDebugModule } from './debug/debug.component';
import { Broadphase } from './models/broadphase';
import { DefaultContactMaterial } from './models/default-contact-material';
import { Solver } from './models/solver';
import { NgtPhysicsStore } from './physics.store';

@Directive({
  selector: 'ngt-physics',
  exportAs: 'ngtPhysics',
  providers: [NgtPhysicsStore],
})
export class NgtPhysics {
  @Input() set size(value: number) {
    this.physicsStore.set({ size: value });
  }

  @Input() set shouldInvalidate(value: boolean) {
    this.physicsStore.set({ shouldInvalidate: value });
  }

  @Input() set tolerance(value: number) {
    this.physicsStore.set({ tolerance: value });
  }

  @Input() set step(value: number) {
    this.physicsStore.set({ step: value });
  }

  @Input() set iterations(value: number) {
    this.physicsStore.set({ iterations: value });
  }

  @Input() set allowSleep(value: boolean) {
    this.physicsStore.set({ allowSleep: value });
  }

  @Input() set broadphase(value: Broadphase) {
    this.physicsStore.set({ broadphase: value });
  }

  @Input() set gravity(value: NgtTriplet) {
    this.physicsStore.set({ gravity: value });
  }

  @Input() set quatNormalizeFast(value: boolean) {
    this.physicsStore.set({ quatNormalizeFast: value });
  }

  @Input() set quatNormalizeSkip(value: number) {
    this.physicsStore.set({ quatNormalizeSkip: value });
  }

  @Input() set solver(value: Solver) {
    this.physicsStore.set({ solver: value });
  }

  @Input() set axisIndex(value: number) {
    this.physicsStore.set({ axisIndex: value });
  }

  @Input() set defaultContactMaterial(value: DefaultContactMaterial) {
    this.physicsStore.set({ defaultContactMaterial: value });
  }

  constructor(private physicsStore: NgtPhysicsStore, ngZone: NgZone) {
    ngZone.runOutsideAngular(() => {
      physicsStore.actions.init();
    });
  }
}

@NgModule({
  declarations: [NgtPhysics],
  exports: [
    NgtPhysics,
    NgtPhysicBodyControllerModule,
    NgtPhysicConstraintControllerModule,
    NgtCannonDebugModule,
  ],
})
export class NgtPhysicsModule {}
