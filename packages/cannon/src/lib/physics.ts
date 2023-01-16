import { injectNgtStore, NgtAnyFunction, NgtAnyRecord, NgtRxStore } from '@angular-three/core';
import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import {
    CannonWorkerAPI,
    CannonWorkerProps,
    WorkerCollideBeginEvent,
    WorkerCollideEndEvent,
    WorkerCollideEvent,
    WorkerFrameMessage,
    WorkerRayhitEvent,
} from '@pmndrs/cannon-worker-api';
import { RxActionFactory } from '@rx-angular/state/actions';
import { filter } from 'rxjs';

import { InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three';
import { injectNgtcStore, NgtcStore } from './store';

const v = new Vector3();
const s = new Vector3(1, 1, 1);
const q = new Quaternion();
const m = new Matrix4();

function apply(index: number, positions: Float32Array, quaternions: Float32Array, scale = s, object?: THREE.Object3D) {
    if (index !== undefined) {
        m.compose(v.fromArray(positions, index * 3), q.fromArray(quaternions, index * 4), scale);
        if (object) {
            object.matrixAutoUpdate = false;
            object.matrix.copy(m);
        }
        return m;
    }
    return m.identity();
}

export interface NgtcPhysicsInputs extends CannonWorkerProps {
    isPaused?: boolean;
    maxSubSteps?: number;
    shouldInvalidate?: boolean;
    stepSize?: number;
}

@Component({
    selector: 'ngtc-physics',
    standalone: true,
    template: '<ng-content />',
    providers: [NgtcStore, RxActionFactory],
})
export class NgtcPhysics extends NgtRxStore<NgtcPhysicsInputs> implements OnInit, OnDestroy {
    readonly #store = injectNgtStore();
    readonly #actions = inject(RxActionFactory<{ setBeforeRender: void }>).create();
    readonly #physicsStore = injectNgtcStore();

    override initialize() {
        super.initialize();
        this.set({
            allowSleep: false,
            axisIndex: 0,
            broadphase: 'Naive',
            defaultContactMaterial: { contactEquationStiffness: 1e6 },
            frictionGravity: null,
            gravity: [0, -9.81, 0],
            isPaused: false,
            iterations: 5,
            maxSubSteps: 10,
            quatNormalizeFast: false,
            quatNormalizeSkip: 0,
            shouldInvalidate: true,
            size: 1000,
            solver: 'GS',
            stepSize: 1 / 60,
            tolerance: 0.001,
        });
    }

    @Input() set allowSleep(allowSleep: NgtcPhysicsInputs['allowSleep']) {
        this.set({ allowSleep });
    }

    @Input() set axisIndex(axisIndex: NgtcPhysicsInputs['axisIndex']) {
        this.set({ axisIndex });
    }

    @Input() set broadphase(broadphase: NgtcPhysicsInputs['broadphase']) {
        this.set({ broadphase });
    }

    @Input() set defaultContactMaterial(defaultContactMaterial: NgtcPhysicsInputs['defaultContactMaterial']) {
        this.set({ defaultContactMaterial });
    }

    @Input() set frictionGravity(frictionGravity: NgtcPhysicsInputs['frictionGravity']) {
        this.set({ frictionGravity });
    }

    @Input() set gravity(gravity: NgtcPhysicsInputs['gravity']) {
        this.set({ gravity });
    }

    @Input() set iterations(iterations: NgtcPhysicsInputs['iterations']) {
        this.set({ iterations });
    }

    @Input() set quatNormalizeFast(quatNormalizeFast: NgtcPhysicsInputs['quatNormalizeFast']) {
        this.set({ quatNormalizeFast });
    }

    @Input() set quatNormalizeSkip(quatNormalizeSkip: NgtcPhysicsInputs['quatNormalizeSkip']) {
        this.set({ quatNormalizeSkip });
    }

    @Input() set solver(solver: NgtcPhysicsInputs['solver']) {
        this.set({ solver });
    }

    @Input() set tolerance(tolerance: NgtcPhysicsInputs['tolerance']) {
        this.set({ tolerance });
    }

    @Input() set size(size: NgtcPhysicsInputs['size']) {
        this.set({ size });
    }

    @Input() set isPaused(isPaused: NgtcPhysicsInputs['isPaused']) {
        this.set({ isPaused });
    }

    @Input() set maxSubSteps(maxSubSteps: NgtcPhysicsInputs['maxSubSteps']) {
        this.set({ maxSubSteps });
    }

    @Input() set shouldInvalidate(shouldInvalidate: NgtcPhysicsInputs['shouldInvalidate']) {
        this.set({ shouldInvalidate });
    }

    @Input() set stepSize(stepSize: NgtcPhysicsInputs['stepSize']) {
        this.set({ stepSize });
    }

    ngOnInit() {
        this.#physicsStore.set({ worker: new CannonWorkerAPI(this.get()) });
        this.#connectWorker();
        this.#setupBeforeRender();
        this.#updateWorkerProp('axisIndex');
        this.#updateWorkerProp('broadphase');
        this.#updateWorkerProp('gravity');
        this.#updateWorkerProp('iterations');
        this.#updateWorkerProp('tolerance');
    }

    override ngOnDestroy() {
        const worker = this.#physicsStore.get('worker');
        if (worker) {
            worker.terminate();
            (worker as unknown as { removeAllListeners: NgtAnyFunction }).removeAllListeners();
        }
        super.ngOnDestroy();
    }

    #setupBeforeRender() {
        let timeSinceLastCalled = 0;
        this.effect(this.#actions.setBeforeRender$, () =>
            this.#store.get('internal').subscribe(({ delta }) => {
                const { isPaused, maxSubSteps, stepSize } = this.get();
                const worker = this.#physicsStore.get('worker');
                if (isPaused || !worker) return;
                timeSinceLastCalled += delta;
                worker.step({ maxSubSteps, timeSinceLastCalled, stepSize: stepSize! });
                timeSinceLastCalled = 0;
            })
        );
        this.#actions.setBeforeRender();
    }

    #connectWorker() {
        this.hold(this.#physicsStore.select('worker').pipe(filter((w) => !!w)), () => {
            const worker = this.#physicsStore.get('worker');
            if (worker) {
                worker.connect();
                worker.init();

                (worker as unknown as { on: NgtAnyFunction }).on('collide', this.#collideHandler.bind(this));
                (worker as unknown as { on: NgtAnyFunction }).on('collideBegin', this.#collideBeginHandler.bind(this));
                (worker as unknown as { on: NgtAnyFunction }).on('collideEnd', this.#collideEndHandler.bind(this));
                (worker as unknown as { on: NgtAnyFunction }).on('frame', this.#frameHandler.bind(this));
                (worker as unknown as { on: NgtAnyFunction }).on('rayhit', this.#rayhitHandler.bind(this));
            }
        });
    }

    #updateWorkerProp(prop: keyof NgtcPhysicsInputs) {
        this.effect(this.select(prop), () => {
            const value = this.get(prop);
            const worker = this.#physicsStore.get('worker');
            if (worker) {
                (worker as NgtAnyRecord)[prop] = value;
            }
        });
    }

    #collideHandler({ body, contact: { bi, bj, ...contactRest }, target, ...rest }: WorkerCollideEvent['data']) {
        const { events, refs } = this.#physicsStore.get();
        const cb = events[target]?.collide;

        if (cb) {
            cb({
                body: refs[body],
                contact: { bi: refs[bi], bj: refs[bj], ...contactRest },
                target: refs[target],
                ...rest,
            });
        }
    }

    #collideBeginHandler({ bodyA, bodyB }: WorkerCollideBeginEvent['data']) {
        const { events, refs } = this.#physicsStore.get();

        const cbA = events[bodyA]?.collideBegin;

        if (cbA) {
            cbA({
                body: refs[bodyB],
                op: 'event',
                target: refs[bodyA],
                type: 'collideBegin',
            });
        }

        const cbB = events[bodyB]?.collideBegin;
        if (cbB) {
            cbB({
                body: refs[bodyA],
                op: 'event',
                target: refs[bodyB],
                type: 'collideBegin',
            });
        }
    }

    #collideEndHandler({ bodyA, bodyB }: WorkerCollideEndEvent['data']) {
        const { events, refs } = this.#physicsStore.get();

        const cbA = events[bodyA]?.collideEnd;

        if (cbA) {
            cbA({
                body: refs[bodyB],
                op: 'event',
                target: refs[bodyA],
                type: 'collideEnd',
            });
        }

        const cbB = events[bodyB]?.collideEnd;
        if (cbB) {
            cbB({
                body: refs[bodyA],
                op: 'event',
                target: refs[bodyB],
                type: 'collideEnd',
            });
        }
    }

    #frameHandler({ active, bodies: uuids = [], observations, positions, quaternions }: WorkerFrameMessage['data']) {
        const { bodies, subscriptions, refs, scaleOverrides } = this.#physicsStore.get();
        const invalidate = this.#store.get('invalidate');
        const shouldInvalidate = this.get('shouldInvalidate');

        for (let i = 0; i < uuids.length; i++) {
            bodies[uuids[i]] = i;
        }

        observations.forEach(([id, value, type]) => {
            const subscription = subscriptions[id] || {};
            const cb = subscription[type];
            // HELP: We clearly know the type of the callback, but typescript can't deal with it
            cb && cb(value as never);
        });

        if (active) {
            for (const ref of Object.values(refs)) {
                if (ref instanceof InstancedMesh) {
                    for (let i = 0; i < ref.count; i++) {
                        const uuid = `${ref.uuid}/${i}`;
                        const index = bodies[uuid];
                        if (index !== undefined) {
                            ref.setMatrixAt(i, apply(index, positions, quaternions, scaleOverrides[uuid]));
                            ref.instanceMatrix.needsUpdate = true;
                        }
                    }
                } else {
                    const scale = scaleOverrides[ref.uuid] || ref.scale;
                    apply(bodies[ref.uuid], positions, quaternions, scale, ref);
                }
            }
            if (shouldInvalidate) {
                invalidate();
            }
        }
    }

    #rayhitHandler({ body, ray: { uuid, ...rayRest }, ...rest }: WorkerRayhitEvent['data']) {
        const { events, refs } = this.#physicsStore.get();
        const cb = events[uuid]?.rayhit;

        if (cb) {
            cb({
                body: body ? refs[body] : null,
                ray: { uuid, ...rayRest },
                ...rest,
            });
        }
    }
}
