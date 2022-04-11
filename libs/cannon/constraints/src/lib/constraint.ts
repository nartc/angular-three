import { NgtPhysicsStore } from '@angular-three/cannon';
import {
    AnyConstructor,
    makeId,
    NgtComponentStore,
    NgtStore,
    tapEffect,
} from '@angular-three/core';
import {
    Directive,
    Input,
    NgZone,
    OnInit,
    Optional,
    Provider,
} from '@angular/core';
import { ConstraintOptns, ConstraintTypes } from '@pmndrs/cannon-worker-api';
import * as THREE from 'three';

export function providePhysicsConstraint<
    TConstraintType extends 'Hinge' | ConstraintTypes,
    TConstraintOptions extends ConstraintOptns,
    TConstraint extends NgtPhysicsConstraint<
        TConstraintType,
        TConstraintOptions
    > = NgtPhysicsConstraint<TConstraintType, TConstraintOptions>
>(constraint: AnyConstructor<TConstraint>): Provider {
    return {
        provide: NgtPhysicsConstraint,
        useExisting: constraint,
    };
}

type ConstraintApi = {
    disable: () => void;
    enable: () => void;
};

type HingeConstraintApi = {
    disable: () => void;
    disableMotor: () => void;
    enable: () => void;
    enableMotor: () => void;
    setMotorMaxForce: (value: number) => void;
    setMotorSpeed: (value: number) => void;
};

type NgtConstraintORHingeApi<T extends 'Hinge' | ConstraintTypes> =
    T extends ConstraintTypes ? ConstraintApi : HingeConstraintApi;

export interface NgtPhysicsConstraintState<
    TConstraintOptions extends ConstraintOptns
> {
    bodies: THREE.Object3D[];
    options: TConstraintOptions;
}

@Directive()
export abstract class NgtPhysicsConstraint<
        TConstraintType extends 'Hinge' | ConstraintTypes,
        TConstraintOptions extends ConstraintOptns
    >
    extends NgtComponentStore<NgtPhysicsConstraintState<TConstraintOptions>>
    implements OnInit
{
    abstract get constraintType(): TConstraintType;

    private readonly uuid = makeId();

    @Input() set options(options: TConstraintOptions) {
        this.set({ options });
    }

    constructor(
        protected zone: NgZone,
        protected store: NgtStore,
        @Optional() protected physicsStore: NgtPhysicsStore
    ) {
        super();

        if (!physicsStore) {
            throw new Error(
                '[ngtCannon***Constraint] directive can only be used inside of <ngt-physics>'
            );
        }

        this.set({ bodies: [], options: {} as TConstraintOptions });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.select());
            });
        });
    }

    addBody(body: THREE.Object3D) {
        this.set((state) => ({ bodies: [...state.bodies, body] }));
    }

    get api(): NgtConstraintORHingeApi<TConstraintType> {
        const worker = this.physicsStore.get((s) => s.worker);

        const enableDisable = {
            disable: () => worker.disableConstraint({ uuid: this.uuid }),
            enable: () => worker.enableConstraint({ uuid: this.uuid }),
        } as NgtConstraintORHingeApi<TConstraintType>;

        if (this.constraintType === 'Hinge') {
            return {
                ...enableDisable,
                disableMotor: () =>
                    worker.disableConstraintMotor({ uuid: this.uuid }),
                enableMotor: () =>
                    worker.enableConstraintMotor({ uuid: this.uuid }),
                setMotorMaxForce: (value: number) =>
                    worker.setConstraintMotorMaxForce({
                        props: value,
                        uuid: this.uuid,
                    }),
                setMotorSpeed: (value: number) =>
                    worker.setConstraintMotorSpeed({
                        props: value,
                        uuid: this.uuid,
                    }),
            };
        }

        return enableDisable;
    }

    private readonly init = this.effect<
        NgtPhysicsConstraintState<TConstraintOptions>
    >(
        tapEffect(({ options, bodies }) => {
            const worker = this.physicsStore.get((s) => s.worker);
            const [bodyA, bodyB] = bodies;

            if (bodyA && bodyB) {
                worker.addConstraint({
                    props: [bodyA.uuid, bodyB.uuid, options],
                    type: this.constraintType,
                    uuid: this.uuid,
                });
                return () => worker.removeConstraint({ uuid: this.uuid });
            }

            return;
        })
    );
}
