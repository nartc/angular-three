import type { NgtTriplet } from '@angular-three/core';
import { Directive, Input, NgModule, OnInit } from '@angular/core';
import type { Broadphase } from './models/broadphase';
import type { DefaultContactMaterial } from './models/default-contact-material';
import type { Solver } from './models/solver';
import { NgtPhysicsStore } from './physics.store';

@Directive({
  selector: 'ngt-physics',
  exportAs: 'ngtPhysics',
  providers: [NgtPhysicsStore],
})
export class NgtPhysics implements OnInit {
  @Input() set size(size: number) {
    this.physicsStore.set({ size });
  }

  @Input() set shouldInvalidate(shouldInvalidate: boolean) {
    this.physicsStore.set({ shouldInvalidate });
  }

  @Input() set tolerance(tolerance: number) {
    this.physicsStore.set({ tolerance });
  }

  @Input() set step(step: number) {
    this.physicsStore.set({ step });
  }

  @Input() set iterations(iterations: number) {
    this.physicsStore.set({ iterations });
  }

  @Input() set allowSleep(allowSleep: boolean) {
    this.physicsStore.set({ allowSleep });
  }

  @Input() set broadphase(broadphase: Broadphase) {
    this.physicsStore.set({ broadphase });
  }

  @Input() set gravity(gravity: NgtTriplet) {
    this.physicsStore.set({ gravity });
  }

  @Input() set quatNormalizeFast(quatNormalizeFast: boolean) {
    this.physicsStore.set({ quatNormalizeFast });
  }

  @Input() set quatNormalizeSkip(quatNormalizeSkip: number) {
    this.physicsStore.set({ quatNormalizeSkip });
  }

  @Input() set solver(solver: Solver) {
    this.physicsStore.set({ solver });
  }

  @Input() set axisIndex(axisIndex: number) {
    this.physicsStore.set({ axisIndex });
  }

  @Input() set defaultContactMaterial(
    defaultContactMaterial: DefaultContactMaterial
  ) {
    this.physicsStore.set({ defaultContactMaterial });
  }

  constructor(private physicsStore: NgtPhysicsStore) {}

  ngOnInit() {
    this.physicsStore.init();
  }
}

@NgModule({
  declarations: [NgtPhysics],
  exports: [NgtPhysics],
})
export class NgtPhysicsModule {}
