import { NgtTriplet } from '@angular-three/core';
import { Directive, Input, NgModule } from '@angular/core';
import { NgtPhysicBodyControllerModule } from './body/body.controller';
import { NgtPhysicConstraintControllerModule } from './constraint/constraint.controller';
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
    this.physicsStore.updaters.setSize(value);
  }

  @Input() set shouldInvalidate(value: boolean) {
    this.physicsStore.updaters.setShouldInvalidate(value);
  }

  @Input() set tolerance(value: number) {
    this.physicsStore.updaters.setTolerance(value);
  }

  @Input() set step(value: number) {
    this.physicsStore.updaters.setStep(value);
  }

  @Input() set iterations(value: number) {
    this.physicsStore.updaters.setIterations(value);
  }

  @Input() set allowSleep(value: boolean) {
    this.physicsStore.updaters.setAllowSleep(value);
  }

  @Input() set broadphase(value: Broadphase) {
    this.physicsStore.updaters.setBroadphase(value);
  }

  @Input() set gravity(value: NgtTriplet) {
    this.physicsStore.updaters.setGravity(value);
  }

  @Input() set quatNormalizeFast(value: boolean) {
    this.physicsStore.updaters.setQuatNormalizeFast(value);
  }

  @Input() set quatNormalizeSkip(value: number) {
    this.physicsStore.updaters.setQuatNormalizeSkip(value);
  }

  @Input() set solver(value: Solver) {
    this.physicsStore.updaters.setSolver(value);
  }

  @Input() set axisIndex(value: number) {
    this.physicsStore.updaters.setAxisIndex(value);
  }

  @Input() set defaultContactMaterial(value: DefaultContactMaterial) {
    this.physicsStore.updaters.setDefaultContactMaterial(value);
  }

  constructor(private physicsStore: NgtPhysicsStore) {
    physicsStore.init();
  }
}

@NgModule({
  declarations: [NgtPhysics],
  exports: [
    NgtPhysics,
    NgtPhysicBodyControllerModule,
    NgtPhysicConstraintControllerModule,
  ],
})
export class NgtPhysicsModule {}
