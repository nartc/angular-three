import type { BooleanInput, NgtTriple, NumberInput } from '@angular-three/core';
import { coerceBooleanProperty, coerceNumberProperty } from '@angular-three/core';
import { Directive, Input, NgModule, OnInit } from '@angular/core';
import type { Broadphase, CannonWorkerProps, ContactMaterialOptions, Solver } from '@pmndrs/cannon-worker-api';
import { NgtPhysicsStore } from './physics.store';

@Directive({
  selector: 'ngt-physics',
  exportAs: 'ngtPhysics',
  providers: [NgtPhysicsStore],
})
export class NgtPhysics implements OnInit {
  @Input() set size(size: NumberInput) {
    this.physicsStore.set({ size: coerceNumberProperty(size) });
  }

  @Input() set shouldInvalidate(shouldInvalidate: BooleanInput) {
    this.physicsStore.set({
      shouldInvalidate: coerceBooleanProperty(shouldInvalidate),
    });
  }

  @Input() set tolerance(tolerance: NumberInput) {
    this.physicsStore.set({ tolerance: coerceNumberProperty(tolerance) });
  }

  @Input() set stepSize(stepSize: NumberInput) {
    this.physicsStore.set({ stepSize: coerceNumberProperty(stepSize) });
  }

  @Input() set iterations(iterations: NumberInput) {
    this.physicsStore.set({ iterations: coerceNumberProperty(iterations) });
  }

  @Input() set allowSleep(allowSleep: BooleanInput) {
    this.physicsStore.set({
      allowSleep: coerceBooleanProperty(allowSleep),
    });
  }

  @Input() set broadphase(broadphase: Broadphase) {
    this.physicsStore.set({ broadphase });
  }

  @Input() set gravity(gravity: NgtTriple) {
    this.physicsStore.set({ gravity });
  }

  @Input() set quatNormalizeFast(quatNormalizeFast: BooleanInput) {
    this.physicsStore.set({
      quatNormalizeFast: coerceBooleanProperty(quatNormalizeFast),
    });
  }

  @Input() set quatNormalizeSkip(quatNormalizeSkip: NumberInput) {
    this.physicsStore.set({
      quatNormalizeSkip: coerceNumberProperty(quatNormalizeSkip),
    });
  }

  @Input() set solver(solver: Solver) {
    this.physicsStore.set({ solver });
  }

  @Input() set axisIndex(axisIndex: CannonWorkerProps['axisIndex']) {
    this.physicsStore.set({ axisIndex });
  }

  @Input() set defaultContactMaterial(defaultContactMaterial: ContactMaterialOptions) {
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
