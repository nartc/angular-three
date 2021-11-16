import { NgtTriplet } from '@angular-three/core';
import { Directive, Input, OnInit } from '@angular/core';
import { Broadphase } from './models/broadphase';
import { DefaultContactMaterial } from './models/default-contact-material';
import { Solver } from './models/solver';
import { PhysicsStore } from './physics.store';

@Directive({
  selector: 'ngt-physics',
  exportAs: 'ngtPhysics',
  providers: [PhysicsStore],
})
export class NgtPhysics implements OnInit {
  @Input() set size(value: number) {
    this.physicsStore.setSize(value);
  }

  @Input() set shouldInvalidate(value: boolean) {
    this.physicsStore.setShouldInvalidate(value);
  }

  @Input() set tolerance(value: number) {
    this.physicsStore.setTolerance(value);
  }

  @Input() set step(value: number) {
    this.physicsStore.setStep(value);
  }

  @Input() set iterations(value: number) {
    this.physicsStore.setIterations(value);
  }

  @Input() set allowSleep(value: boolean) {
    this.physicsStore.setAllowSleep(value);
  }

  @Input() set broadphase(value: Broadphase) {
    this.physicsStore.setBroadphase(value);
  }

  @Input() set gravity(value: NgtTriplet) {
    this.physicsStore.setGravity(value);
  }

  @Input() set quatNormalizeFast(value: boolean) {
    this.physicsStore.setQuatNormalizeFast(value);
  }

  @Input() set quatNormalizeSkip(value: number) {
    this.physicsStore.setQuatNormalizeSkip(value);
  }

  @Input() set solver(value: Solver) {
    this.physicsStore.setSolver(value);
  }

  @Input() set axisIndex(value: number) {
    this.physicsStore.setAxisIndex(value);
  }

  @Input() set defaultContactMaterial(value: DefaultContactMaterial) {
    this.physicsStore.setDefaultContactMaterial(value);
  }

  constructor(private physicsStore: PhysicsStore) {}

  ngOnInit() {
    this.physicsStore.initEffect();
    this.physicsStore.updateWorldPropsEffect();
  }
}
