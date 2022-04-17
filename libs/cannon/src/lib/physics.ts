import type { BooleanInput, NgtTriple } from '@angular-three/core';
import { coerceBooleanProperty } from '@angular-three/core';
import { Directive, Input, NgModule, OnInit } from '@angular/core';
import type {
    Broadphase,
    CannonWorkerProps,
    ContactMaterialOptions,
    Solver,
} from '@pmndrs/cannon-worker-api';
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

    @Input() set shouldInvalidate(shouldInvalidate: BooleanInput) {
        this.physicsStore.set({
            shouldInvalidate: coerceBooleanProperty(shouldInvalidate),
        });
    }

    @Input() set tolerance(tolerance: number) {
        this.physicsStore.set({ tolerance });
    }

    @Input() set stepSize(stepSize: number) {
        this.physicsStore.set({ stepSize });
    }

    @Input() set iterations(iterations: number) {
        this.physicsStore.set({ iterations });
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

    @Input() set quatNormalizeSkip(quatNormalizeSkip: number) {
        this.physicsStore.set({ quatNormalizeSkip });
    }

    @Input() set solver(solver: Solver) {
        this.physicsStore.set({ solver });
    }

    @Input() set axisIndex(axisIndex: CannonWorkerProps['axisIndex']) {
        this.physicsStore.set({ axisIndex });
    }

    @Input() set defaultContactMaterial(
        defaultContactMaterial: ContactMaterialOptions
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
