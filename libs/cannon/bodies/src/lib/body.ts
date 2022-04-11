import type { CannonEvents } from '@angular-three/cannon';
import { NgtPhysicsStore } from '@angular-three/cannon';
import { NgtCannonDebug } from '@angular-three/cannon/debug';
import type {
    AnyConstructor,
    AnyFunction,
    NgtQuadruple,
    NgtTriple,
} from '@angular-three/core';
import {
    NGT_OBJECT_FACTORY,
    NgtComponentStore,
    NgtStore,
    tapEffect,
} from '@angular-three/core';
import {
    Directive,
    Inject,
    Input,
    NgZone,
    OnInit,
    Optional,
    Provider,
} from '@angular/core';
import type {
    AtomicName,
    AtomicProps,
    BodyProps,
    BodyShapeType,
    CannonWorkerAPI,
    PropValue,
    SetOpName,
    SubscriptionName,
    Subscriptions,
    SubscriptionTarget,
    VectorName,
} from '@pmndrs/cannon-worker-api';
import * as THREE from 'three';

const temp = new THREE.Object3D();

function capitalize<T extends string>(str: T): Capitalize<T> {
    return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

function getUUID(object: THREE.Object3D, index?: number): string | null {
    const suffix = index === undefined ? '' : `/${index}`;
    if (typeof object === 'function') return null;
    return object && object && `${object.uuid}${suffix}`;
}

const e = new THREE.Euler();
const q = new THREE.Quaternion();

const quaternionToRotation = (callback: (v: NgtTriple) => void) => {
    return (v: NgtQuadruple) =>
        callback(e.setFromQuaternion(q.fromArray(v)).toArray() as NgtTriple);
};

let incrementingId = 0;

function subscribe<T extends SubscriptionName>(
    object: THREE.Object3D,
    worker: CannonWorkerAPI,
    subscriptions: Subscriptions,
    type: T,
    index?: number,
    target: SubscriptionTarget = 'bodies'
) {
    return (callback: (value: PropValue<T>) => void) => {
        const id = incrementingId++;
        subscriptions[id] = { [type]: callback };
        const uuid = getUUID(object, index);
        uuid && worker.subscribe({ props: { id, target, type }, uuid });
        return () => {
            delete subscriptions[id];
            worker.unsubscribe({ props: id });
        };
    };
}

function prepare(
    object: THREE.Object3D,
    { position = [0, 0, 0], rotation = [0, 0, 0], userData = {} }: BodyProps
) {
    object.userData = userData;
    object.position.set(...position);
    object.rotation.set(...rotation);
    object.updateMatrix();
}

function setupCollision(
    events: CannonEvents,
    { onCollide, onCollideBegin, onCollideEnd }: Partial<BodyProps>,
    uuid: string
) {
    events[uuid] = {
        collide: onCollide,
        collideBegin: onCollideBegin,
        collideEnd: onCollideEnd,
    };
}

export function makeTriplet(v: THREE.Vector3 | NgtTriple): NgtTriple {
    return v instanceof THREE.Vector3 ? [v.x, v.y, v.z] : v;
}

export function providePhysicsBody<
    TBodyType extends BodyShapeType,
    TBodyProps extends BodyProps,
    TBody extends NgtPhysicsBody<TBodyType, TBodyProps> = NgtPhysicsBody<
        TBodyType,
        TBodyProps
    >
>(body: AnyConstructor<TBody>): Provider {
    return {
        provide: NgtPhysicsBody,
        useExisting: body,
    };
}

export type GetByIndex<T extends BodyProps> = (index: number) => T;
type ArgFn<T> = (args: T) => unknown[];

export type AtomicApi<K extends AtomicName> = {
    set: (value: AtomicProps[K]) => void;
    subscribe: (callback: (value: AtomicProps[K]) => void) => () => void;
};

export type QuaternionApi = {
    copy: ({ w, x, y, z }: THREE.Quaternion) => void;
    set: (x: number, y: number, z: number, w: number) => void;
    subscribe: (callback: (value: NgtQuadruple) => void) => () => void;
};

export type VectorApi = {
    copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => void;
    set: (x: number, y: number, z: number) => void;
    subscribe: (callback: (value: NgtTriple) => void) => () => void;
};

export type WorkerApi = {
    [K in AtomicName]: AtomicApi<K>;
} & {
    [K in VectorName]: VectorApi;
} & {
    applyForce: (force: NgtTriple, worldPoint: NgtTriple) => void;
    applyImpulse: (impulse: NgtTriple, worldPoint: NgtTriple) => void;
    applyLocalForce: (force: NgtTriple, localPoint: NgtTriple) => void;
    applyLocalImpulse: (impulse: NgtTriple, localPoint: NgtTriple) => void;
    applyTorque: (torque: NgtTriple) => void;
    quaternion: QuaternionApi;
    rotation: VectorApi;
    scaleOverride: (scale: NgtTriple) => void;
    sleep: () => void;
    wakeUp: () => void;
};

export interface NgtPhysicsBodyPublicApi extends WorkerApi {
    at: (index: number) => WorkerApi;
}

export interface NgtPhysicsBodyState<TBodyProps extends BodyProps> {
    object: THREE.Object3D;
    argsFn: ArgFn<TBodyProps['args']>;
    getPhysicProps: GetByIndex<TBodyProps>;
}

@Directive()
export abstract class NgtPhysicsBody<
        TBodyType extends BodyShapeType,
        TBodyProps extends BodyProps
    >
    extends NgtComponentStore<NgtPhysicsBodyState<TBodyProps>>
    implements OnInit
{
    abstract get bodyType(): TBodyType;

    @Input() set getPhysicProps(getPhysicProps: GetByIndex<TBodyProps>) {
        this.set({ getPhysicProps } as Partial<
            NgtPhysicsBodyState<TBodyProps>
        >);
    }

    constructor(
        protected zone: NgZone,
        protected store: NgtStore,
        protected physicsStore: NgtPhysicsStore,
        @Optional()
        protected debug: NgtCannonDebug,
        @Optional()
        @Inject(NGT_OBJECT_FACTORY)
        protected parentObjectFactory: AnyFunction
    ) {
        super();
        this.set({
            object: parentObjectFactory?.(),
            argsFn: (args: TBodyProps['args']) => args as unknown[],
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.preInit();
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.select((s) => s.getPhysicProps));
            });
        });
    }

    /**
     * Sub-classes can use this to run additional logic before init. Outside of Angular
     * @protected
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    protected preInit(): void {}

    get api(): NgtPhysicsBodyPublicApi {
        this.set((s) => {
            const parent = this.parentObjectFactory?.();
            if (parent && s.object !== parent) {
                return { ...s, object: parent };
            }
            return s;
        });
        const { worker, subscriptions, scaleOverrides } =
            this.physicsStore.get();
        const object = this.get((s) => s.object)!;

        const makeAtomic = <T extends AtomicName>(type: T, index?: number) => {
            const op: SetOpName<T> = `set${capitalize(type)}`;

            return {
                set: (value: PropValue<T>) => {
                    const uuid = getUUID(object, index);
                    uuid &&
                        worker[op]({
                            props: value,
                            uuid,
                        } as never);
                },
                subscribe: subscribe(
                    object,
                    worker,
                    subscriptions,
                    type,
                    index
                ),
            };
        };

        const makeQuaternion = (index?: number) => {
            const type = 'quaternion';
            return {
                copy: ({ w, x, y, z }: THREE.Quaternion) => {
                    const uuid = getUUID(object, index);
                    uuid && worker.setQuaternion({ props: [x, y, z, w], uuid });
                },
                set: (x: number, y: number, z: number, w: number) => {
                    const uuid = getUUID(object, index);
                    uuid && worker.setQuaternion({ props: [x, y, z, w], uuid });
                },
                subscribe: subscribe(
                    object,
                    worker,
                    subscriptions,
                    type,
                    index
                ),
            };
        };

        const makeRotation = (index?: number) => {
            return {
                copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => {
                    const uuid = getUUID(object, index);
                    uuid && worker.setRotation({ props: [x, y, z], uuid });
                },
                set: (x: number, y: number, z: number) => {
                    const uuid = getUUID(object, index);
                    uuid && worker.setRotation({ props: [x, y, z], uuid });
                },
                subscribe: (callback: (value: NgtTriple) => void) => {
                    const id = incrementingId++;
                    const target = 'bodies';
                    const type = 'quaternion';
                    const uuid = getUUID(object, index);

                    subscriptions[id] = {
                        [type]: quaternionToRotation(callback),
                    };
                    uuid &&
                        worker.subscribe({ props: { id, target, type }, uuid });
                    return () => {
                        delete subscriptions[id];
                        worker.unsubscribe({ props: id });
                    };
                },
            };
        };

        const makeVec = (type: VectorName, index?: number) => {
            const op: SetOpName<VectorName> = `set${capitalize(type)}`;
            return {
                copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => {
                    const uuid = getUUID(object, index);
                    uuid && worker[op]({ props: [x, y, z], uuid });
                },
                set: (x: number, y: number, z: number) => {
                    const uuid = getUUID(object, index);
                    uuid && worker[op]({ props: [x, y, z], uuid });
                },
                subscribe: subscribe(
                    object,
                    worker,
                    subscriptions,
                    type,
                    index
                ),
            };
        };

        function makeApi(index?: number): WorkerApi {
            return {
                allowSleep: makeAtomic('allowSleep', index),
                angularDamping: makeAtomic('angularDamping', index),
                angularFactor: makeVec('angularFactor', index),
                angularVelocity: makeVec('angularVelocity', index),
                applyForce(force: NgtTriple, worldPoint: NgtTriple) {
                    const uuid = getUUID(object, index);
                    uuid &&
                        worker.applyForce({ props: [force, worldPoint], uuid });
                },
                applyImpulse(impulse: NgtTriple, worldPoint: NgtTriple) {
                    const uuid = getUUID(object, index);
                    uuid &&
                        worker.applyImpulse({
                            props: [impulse, worldPoint],
                            uuid,
                        });
                },
                applyLocalForce(force: NgtTriple, localPoint: NgtTriple) {
                    const uuid = getUUID(object, index);
                    uuid &&
                        worker.applyLocalForce({
                            props: [force, localPoint],
                            uuid,
                        });
                },
                applyLocalImpulse(impulse: NgtTriple, localPoint: NgtTriple) {
                    const uuid = getUUID(object, index);
                    uuid &&
                        worker.applyLocalImpulse({
                            props: [impulse, localPoint],
                            uuid,
                        });
                },
                applyTorque(torque: NgtTriple) {
                    const uuid = getUUID(object, index);
                    uuid && worker.applyTorque({ props: [torque], uuid });
                },
                collisionFilterGroup: makeAtomic('collisionFilterGroup', index),
                collisionFilterMask: makeAtomic('collisionFilterMask', index),
                collisionResponse: makeAtomic('collisionResponse', index),
                fixedRotation: makeAtomic('fixedRotation', index),
                isTrigger: makeAtomic('isTrigger', index),
                linearDamping: makeAtomic('linearDamping', index),
                linearFactor: makeVec('linearFactor', index),
                mass: makeAtomic('mass', index),
                material: makeAtomic('material', index),
                position: makeVec('position', index),
                quaternion: makeQuaternion(index),
                rotation: makeRotation(index),
                scaleOverride(scale) {
                    const uuid = getUUID(object, index);
                    if (uuid)
                        scaleOverrides[uuid] = new THREE.Vector3(...scale);
                },
                sleep() {
                    const uuid = getUUID(object, index);
                    uuid && worker.sleep({ uuid });
                },
                sleepSpeedLimit: makeAtomic('sleepSpeedLimit', index),
                sleepTimeLimit: makeAtomic('sleepTimeLimit', index),
                userData: makeAtomic('userData', index),
                velocity: makeVec('velocity', index),
                wakeUp() {
                    const uuid = getUUID(object, index);
                    uuid && worker.wakeUp({ uuid });
                },
            };
        }

        const cache: { [index: number]: WorkerApi } = {};
        return {
            ...makeApi(undefined),
            at: (index: number) =>
                cache[index] || (cache[index] = makeApi(index)),
        };
    }

    private readonly init = this.effect<
        NgtPhysicsBodyState<TBodyProps>['getPhysicProps']
    >(
        tapEffect(() => {
            this.set({ object: this.parentObjectFactory?.() });

            if (!this.get((s) => s.object)) {
                this.set({ object: new THREE.Object3D() });
            }

            const { object, argsFn, getPhysicProps } = this.get();

            const { worker, refs, events } = this.physicsStore.get();
            const currentWorker = worker;
            let objectCount = 1;
            if (object instanceof THREE.InstancedMesh) {
                object.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                objectCount = object.count;
            }

            const uuid =
                object instanceof THREE.InstancedMesh
                    ? new Array(objectCount)
                          .fill(0)
                          .map((_, i) => `${object.uuid}/${i}`)
                    : [object.uuid];

            const props: (TBodyProps & { args: unknown })[] = uuid.map(
                (id, i) => {
                    const props = getPhysicProps(i);
                    prepare(temp, props);
                    if (object instanceof THREE.InstancedMesh) {
                        object.setMatrixAt(i, temp.matrix);
                        object.instanceMatrix.needsUpdate = true;
                    }

                    refs[id] = object;
                    if (this.debug) {
                        this.debug.api.add(id, props, this.bodyType);
                    }
                    setupCollision(events, props, id);
                    return { ...props, args: argsFn(props.args) };
                }
            );

            // Register on mount, unregister on unmount
            currentWorker.addBodies({
                props: props.map(({ onCollide, ...serializableProps }) => {
                    return {
                        onCollide: Boolean(onCollide),
                        ...serializableProps,
                    };
                }),
                type: this.bodyType,
                uuid,
            });

            return () => {
                uuid.forEach((id) => {
                    delete refs[id];
                    if (this.debug) {
                        this.debug.api.remove(id);
                    }
                    delete events[id];
                });
                currentWorker.removeBodies({ uuid });
            };
        })
    );
}
