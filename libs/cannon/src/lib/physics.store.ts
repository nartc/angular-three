import {
    NgtAnimationFrameStore,
    NgtCanvasStore,
    NgtLoop,
    NgtStore,
} from '@angular-three/core';
import { Injectable, NgZone } from '@angular/core';
import { map, noop, tap } from 'rxjs';
import * as THREE from 'three';
import type { Buffers } from './models/buffers';
import type {
    IncomingWorkerMessage,
    WorkerFrameMessage,
} from './models/messages';
import type { NgtPhysicsState } from './models/physics-state';

const v = new THREE.Vector3();
const s = new THREE.Vector3(1, 1, 1);
const q = new THREE.Quaternion();
const m = new THREE.Matrix4();

@Injectable()
export class NgtPhysicsStore extends NgtStore<NgtPhysicsState> {
    private animationUuid = '';

    constructor(
        private zone: NgZone,
        private animationFrameStore: NgtAnimationFrameStore,
        private canvasStore: NgtCanvasStore,
        private loop: NgtLoop
    ) {
        super();
        this.set({
            worker: new Worker(
                new URL('./utils/worker', import.meta.url)
            ) as Worker,
            refs: {},
            buffers: {
                positions: new Float32Array(1000 * 3),
                quaternions: new Float32Array(1000 * 4),
            },
            events: {},
            subscriptions: {},
            bodies: {},
            shouldInvalidate: true,
            step: 1 / 60,
            gravity: [0, -9.81, 0],
            tolerance: 0.001,
            iterations: 5,
            allowSleep: false,
            broadphase: 'Naive',
            axisIndex: 0,
            quatNormalizeFast: false,
            quatNormalizeSkip: 0,
            solver: 'GS',
            defaultContactMaterial: { contactEquationStiffness: 1e6 },
            size: 1000,
        });
    }

    private bufferParams$ = this.select((s) => s.size).pipe(
        map((size) => ({
            buffers: {
                positions: new Float32Array((size as number) * 3),
                quaternions: new Float32Array((size as number) * 4),
            },
        }))
    );

    private readonly setAxisIndex = this.effect<NgtPhysicsState['axisIndex']>(
        tap((axisIndex) => {
            const worker = this.get((s) => s.worker);
            worker.postMessage({ op: 'setAxisIndex', props: axisIndex });
        })
    );

    private readonly setBroadphase = this.effect<NgtPhysicsState['broadphase']>(
        tap((broadphase) => {
            const worker = this.get((s) => s.worker);
            worker.postMessage({ op: 'setBroadphase', props: broadphase });
        })
    );
    private readonly setGravity = this.effect<NgtPhysicsState['gravity']>(
        tap((gravity) => {
            const worker = this.get((s) => s.worker);
            worker.postMessage({ op: 'setGravity', props: gravity });
        })
    );
    private readonly setIterations = this.effect<NgtPhysicsState['iterations']>(
        tap((iterations) => {
            const worker = this.get((s) => s.worker);
            worker.postMessage({ op: 'setIterations', props: iterations });
        })
    );
    private readonly setStep = this.effect<NgtPhysicsState['step']>(
        tap((step) => {
            const worker = this.get((s) => s.worker);
            worker.postMessage({ op: 'setStep', props: step });
        })
    );
    private readonly setTolerance = this.effect<NgtPhysicsState['tolerance']>(
        tap((tolerance) => {
            const worker = this.get((s) => s.worker);
            worker.postMessage({ op: 'setTolerance', props: tolerance });
        })
    );

    init() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.set(this.bufferParams$);

                this.initWorker();
                this.initLoop();

                this.setAxisIndex(this.select((s) => s.axisIndex));
                this.setBroadphase(this.select((s) => s.broadphase));
                this.setGravity(this.select((s) => s.gravity));
                this.setIterations(this.select((s) => s.iterations));
                this.setStep(this.select((s) => s.step));
                this.setTolerance(this.select((s) => s.tolerance));
            });
        });
    }

    private initWorker() {
        const worker = this.get((s) => s.worker);

        worker.postMessage({ op: 'init', props: this.initProps });

        let i = 0;
        let body: string;
        let callback;
        worker.onmessage = (e: IncomingWorkerMessage) => {
            const {
                shouldInvalidate,
                buffers,
                bodies,
                subscriptions,
                events,
                refs,
            } = this.get();

            switch (e.data.op) {
                case 'frame':
                    buffers.positions = e.data.positions;
                    buffers.quaternions = e.data.quaternions;
                    if (e.data.bodies) {
                        for (i = 0; i < e.data.bodies.length; i++) {
                            body = e.data.bodies[i];
                            bodies[body] = e.data.bodies.indexOf(body);
                            this.set((state) => ({
                                bodies: {
                                    ...state.bodies,
                                    [body]: (
                                        (e.data as WorkerFrameMessage['data'])
                                            .bodies as string[]
                                    ).indexOf(body),
                                },
                            }));
                        }
                    }

                    e.data.observations.forEach(([id, value, type]) => {
                        const subscription = subscriptions[id] || {};
                        callback = subscription[type] || noop;
                        // HELP: We clearly know the type of the callback, but typescript can't deal with it
                        callback(value as never);
                    });

                    if (e.data.active) {
                        for (const ref of Object.values(refs)) {
                            if (ref instanceof THREE.InstancedMesh) {
                                for (let i = 0; i < ref.count; i++) {
                                    const index = bodies[`${ref.uuid}/${i}`];
                                    if (index !== undefined) {
                                        ref.setMatrixAt(
                                            i,
                                            apply(index, buffers)
                                        );
                                    }
                                    ref.instanceMatrix.needsUpdate = true;
                                }
                            } else {
                                apply(bodies[ref.uuid], buffers, ref);
                            }
                        }

                        if (shouldInvalidate) {
                            this.loop.invalidate();
                        }
                    }

                    break;

                case 'event':
                    switch (e.data.type) {
                        case 'collide':
                            callback = events[e.data.target]?.collide || noop;
                            callback({
                                ...e.data,
                                target: refs[e.data.target],
                                body: refs[e.data.body],
                                contact: {
                                    ...e.data.contact,
                                    bi: refs[e.data.contact.bi],
                                    bj: refs[e.data.contact.bj],
                                },
                            });
                            break;
                        case 'collideBegin':
                            callback =
                                events[e.data.bodyA]?.collideBegin || noop;
                            callback({
                                op: 'event',
                                type: 'collideBegin',
                                target: refs[e.data.bodyA],
                                body: refs[e.data.bodyB],
                            });
                            callback =
                                events[e.data.bodyB]?.collideBegin || noop;
                            callback({
                                op: 'event',
                                type: 'collideBegin',
                                target: refs[e.data.bodyB],
                                body: refs[e.data.bodyA],
                            });
                            break;
                        case 'collideEnd':
                            callback = events[e.data.bodyA]?.collideEnd || noop;
                            callback({
                                op: 'event',
                                type: 'collideEnd',
                                target: refs[e.data.bodyA],
                                body: refs[e.data.bodyB],
                            });
                            callback = events[e.data.bodyB]?.collideEnd || noop;
                            callback({
                                op: 'event',
                                type: 'collideEnd',
                                target: refs[e.data.bodyB],
                                body: refs[e.data.bodyA],
                            });
                            break;
                        case 'rayhit':
                            callback = events[e.data.ray.uuid]?.rayhit || noop;
                            callback({
                                ...e.data,
                                body: e.data.body ? refs[e.data.body] : null,
                            });
                            break;
                    }
                    break;
            }
        };
    }

    private initLoop() {
        this.animationUuid = this.animationFrameStore.register({
            callback: () => {
                const { worker, buffers } = this.get();
                if (
                    buffers.positions.byteLength !== 0 &&
                    buffers.quaternions.byteLength !== 0
                ) {
                    worker.postMessage({ op: 'step', ...buffers }, [
                        buffers.positions.buffer,
                        buffers.quaternions.buffer,
                    ]);
                }
            },
        });
    }

    private get initProps() {
        const {
            gravity,
            tolerance,
            step,
            iterations,
            broadphase,
            allowSleep,
            axisIndex,
            defaultContactMaterial,
            quatNormalizeFast,
            quatNormalizeSkip,
            solver,
        } = this.get();

        return {
            gravity,
            tolerance,
            step,
            iterations,
            broadphase,
            allowSleep,
            axisIndex,
            defaultContactMaterial,
            quatNormalizeFast,
            quatNormalizeSkip,
            solver,
        };
    }

    override ngOnDestroy() {
        this.get((s) => s.worker).terminate();
        this.animationFrameStore.unregister(this.animationUuid);
        super.ngOnDestroy();
    }
}

function apply(index: number, buffers: Buffers, object?: THREE.Object3D) {
    if (index !== undefined) {
        m.compose(
            v.fromArray(buffers.positions, index * 3),
            q.fromArray(buffers.quaternions, index * 4),
            object ? object.scale : s
        );
        if (object) {
            object.matrixAutoUpdate = false;
            object.matrix.copy(m);
        }
        return m;
    }
    return m.identity();
}
