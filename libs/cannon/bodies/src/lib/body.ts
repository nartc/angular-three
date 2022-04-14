import type { CannonEvents } from '@angular-three/cannon';
import { NgtPhysicsStore } from '@angular-three/cannon';
import { NgtCannonDebug } from '@angular-three/cannon/debug';
import {
    applyProps,
    make,
    makeVector3,
    NgtComponentStore,
    NgtQuadruple,
    NgtStore,
    NgtTriple,
    NgtUnknownInstance,
    Ref,
    tapEffect,
    UnknownRecord,
} from '@angular-three/core';
import { Injectable, NgZone, Optional } from '@angular/core';
import type {
    AtomicName,
    AtomicProps,
    BodyProps,
    BodyShapeType,
    BoxProps,
    CompoundBodyProps,
    ConvexPolyhedronArgs,
    ConvexPolyhedronProps,
    CylinderProps,
    HeightfieldProps,
    ParticleProps,
    PlaneProps,
    PropValue,
    SetOpName,
    SphereArgs,
    SphereProps,
    SubscriptionName,
    Subscriptions,
    SubscriptionTarget,
    TrimeshProps,
    VectorName,
} from '@pmndrs/cannon-worker-api';
import { CannonWorkerAPI } from '@pmndrs/cannon-worker-api';
import { combineLatest, skip } from 'rxjs';
import * as THREE from 'three';

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

export interface NgtPhysicBodyReturn {
    ref: Ref<THREE.Object3D>;
    api: NgtPhysicsBodyPublicApi;
}

export type GetByIndex<T extends BodyProps> = (index: number) => T;
type ArgFn<T> = (args: T) => unknown[];

const temp = new THREE.Object3D();

function applyBodyProps<TBodyProps extends BodyProps>(
    ref: Ref<THREE.Object3D>,
    props: TBodyProps
) {
    const objectProps: UnknownRecord = {};
    if (props.position) {
        objectProps['position'] = makeVector3(props.position);
    }

    if (props.quaternion) {
        objectProps['quaternion'] = make(THREE.Quaternion, props.quaternion);
    } else if (props.rotation) {
        objectProps['rotation'] = make(THREE.Euler, props.rotation);
    }

    if (props.userData) {
        objectProps['userData'] = props.userData;
    }

    applyProps(ref.value as unknown as NgtUnknownInstance, objectProps);
}

function capitalize<T extends string>(str: T): Capitalize<T> {
    return (str.charAt(0).toUpperCase() + str.slice(1)) as Capitalize<T>;
}

function getUUID(ref: Ref<THREE.Object3D>, index?: number): string | null {
    const suffix = index === undefined ? '' : `/${index}`;
    if (typeof ref === 'function') return null;
    return ref && ref.value && `${ref.value.uuid}${suffix}`;
}

const e = new THREE.Euler();
const q = new THREE.Quaternion();

const quaternionToRotation = (callback: (v: NgtTriple) => void) => {
    return (v: NgtQuadruple) =>
        callback(e.setFromQuaternion(q.fromArray(v)).toArray() as NgtTriple);
};

let incrementingId = 0;

function subscribe<T extends SubscriptionName>(
    ref: Ref<THREE.Object3D>,
    worker: CannonWorkerAPI,
    subscriptions: Subscriptions,
    type: T,
    index?: number,
    target: SubscriptionTarget = 'bodies'
) {
    return (callback: (value: PropValue<T>) => void) => {
        const id = incrementingId++;
        subscriptions[id] = { [type]: callback };
        const uuid = getUUID(ref, index);
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

@Injectable()
export class NgtPhysicBody extends NgtComponentStore {
    constructor(
        private zone: NgZone,
        private store: NgtStore,
        @Optional() private physicsStore: NgtPhysicsStore,
        @Optional()
        private debug: NgtCannonDebug
    ) {
        if (!physicsStore) {
            throw new Error(
                'NgtPhysicBody must be used inside of <ngt-physics>'
            );
        }

        super();
    }

    usePlane(fn: GetByIndex<PlaneProps>, ref?: Ref<THREE.Object3D>) {
        return this.useBody('Plane', fn, () => [], ref);
    }

    useBox(fn: GetByIndex<BoxProps>, ref?: Ref<THREE.Object3D>) {
        const defaultBoxArgs: NgtTriple = [1, 1, 1];
        return this.useBody(
            'Box',
            fn,
            (args = defaultBoxArgs): NgtTriple => args,
            ref
        );
    }

    useCylinder(fn: GetByIndex<CylinderProps>, ref?: Ref<THREE.Object3D>) {
        return this.useBody('Cylinder', fn, (args = [] as []) => args, ref);
    }

    useHeightfield(
        fn: GetByIndex<HeightfieldProps>,
        ref?: Ref<THREE.Object3D>
    ) {
        return this.useBody('Heightfield', fn, (args) => args, ref);
    }

    useParticle(fn: GetByIndex<ParticleProps>, ref?: Ref<THREE.Object3D>) {
        return this.useBody('Particle', fn, () => [], ref);
    }

    useSphere(fn: GetByIndex<SphereProps>, ref?: Ref<THREE.Object3D>) {
        return this.useBody(
            'Sphere',
            fn,
            (args: SphereArgs = [1]): SphereArgs => {
                if (!Array.isArray(args))
                    throw new Error('useSphere args must be an array');
                return [args[0]];
            },
            ref
        );
    }

    useTrimesh(fn: GetByIndex<TrimeshProps>, ref?: Ref<THREE.Object3D>) {
        return this.useBody<TrimeshProps>('Trimesh', fn, (args) => args, ref);
    }

    useConvexPolyhedron(
        fn: GetByIndex<ConvexPolyhedronProps>,
        ref?: Ref<THREE.Object3D>
    ) {
        return this.useBody<ConvexPolyhedronProps>(
            'ConvexPolyhedron',
            fn,
            ([
                vertices,
                faces,
                normals,
                axes,
                boundingSphereRadius,
            ] = []): ConvexPolyhedronArgs<NgtTriple> => [
                vertices && vertices.map(makeTriplet),
                faces,
                normals && normals.map(makeTriplet),
                axes && axes.map(makeTriplet),
                boundingSphereRadius,
            ],
            ref
        );
    }

    useCompoundBody(
        fn: GetByIndex<CompoundBodyProps>,
        ref?: Ref<THREE.Object3D>
    ) {
        return this.useBody('Compound', fn, (args) => args as unknown[], ref);
    }

    private useBody<TBodyProps extends BodyProps>(
        type: BodyShapeType,
        getPropsFn: GetByIndex<TBodyProps>,
        argsFn: ArgFn<TBodyProps['args']>,
        instanceRef?: Ref<THREE.Object3D>
    ): { ref: Ref<THREE.Object3D>; api: NgtPhysicsBodyPublicApi } {
        return this.zone.runOutsideAngular(() => {
            const isUsedRef = new Ref(false);

            let ref = instanceRef as Ref<THREE.Object3D>;

            if (!ref) {
                ref = new Ref<THREE.Object3D>();
            }

            const physicsStore = this.physicsStore;

            this.onCanvasReady(this.store.ready$, () => {
                this.effect<[CannonWorkerAPI, THREE.Object3D, boolean]>(
                    tapEffect(() => {
                        // if ref.value is null and it is not being used on a ngt object, assign a blank Object3d
                        if (ref.value == null) {
                            if (isUsedRef.value) {
                                return;
                            }

                            ref.set(new THREE.Object3D());
                        }

                        const { worker, refs, events } = physicsStore.get();
                        const object = ref.value;
                        let objectCount = 1;

                        if (object instanceof THREE.InstancedMesh) {
                            object.instanceMatrix.setUsage(
                                THREE.DynamicDrawUsage
                            );
                            objectCount = object.count;
                        }

                        const uuid =
                            object instanceof THREE.InstancedMesh
                                ? new Array(objectCount)
                                      .fill(0)
                                      .map((_, i) => `${object.uuid}/${i}`)
                                : [object.uuid];

                        const props: (TBodyProps & { args: unknown })[] =
                            uuid.map((id, i) => {
                                const props = getPropsFn(i);
                                prepare(temp, props);
                                if (object instanceof THREE.InstancedMesh) {
                                    object.setMatrixAt(i, temp.matrix);
                                    object.instanceMatrix.needsUpdate = true;
                                }

                                refs[id] = object;

                                if (this.debug) {
                                    this.debug.api.add(id, props, type);
                                }

                                setupCollision(events, props, id);

                                if (!(object instanceof THREE.InstancedMesh)) {
                                    applyBodyProps(ref, props);
                                }

                                return {
                                    ...props,
                                    args: argsFn(props.args),
                                };
                            });

                        // Register on mount, unregister on unmount
                        worker.addBodies({
                            props: props.map(
                                ({
                                    onCollide,
                                    onCollideBegin,
                                    onCollideEnd,
                                    ...serializableProps
                                }) => {
                                    return {
                                        onCollide: Boolean(onCollide),
                                        onCollideBegin: Boolean(onCollideBegin),
                                        onCollideEnd: Boolean(onCollideEnd),
                                        ...serializableProps,
                                    };
                                }
                            ),
                            type,
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
                            worker.removeBodies({ uuid });
                        };
                    })
                )(
                    combineLatest([
                        physicsStore.select((s) => s.worker),
                        ref.ref$,
                        isUsedRef.ref$,
                        // TODO: not sure why we need to skip 1 :(
                    ]).pipe(skip(1))
                );
            });

            return {
                get ref() {
                    if (!isUsedRef.value) {
                        isUsedRef.set(true);
                    }
                    return ref;
                },
                get api() {
                    const { worker, subscriptions, scaleOverrides } =
                        physicsStore.get();

                    const makeAtomic = <T extends AtomicName>(
                        type: T,
                        index?: number
                    ) => {
                        const op: SetOpName<T> = `set${capitalize(type)}`;

                        return {
                            set: (value: PropValue<T>) => {
                                const uuid = getUUID(ref, index);
                                uuid &&
                                    worker[op]({
                                        props: value,
                                        uuid,
                                    } as never);
                            },
                            subscribe: subscribe(
                                ref,
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
                                const uuid = getUUID(ref, index);
                                uuid &&
                                    worker.setQuaternion({
                                        props: [x, y, z, w],
                                        uuid,
                                    });
                            },
                            set: (
                                x: number,
                                y: number,
                                z: number,
                                w: number
                            ) => {
                                const uuid = getUUID(ref, index);
                                uuid &&
                                    worker.setQuaternion({
                                        props: [x, y, z, w],
                                        uuid,
                                    });
                            },
                            subscribe: subscribe(
                                ref,
                                worker,
                                subscriptions,
                                type,
                                index
                            ),
                        };
                    };

                    const makeRotation = (index?: number) => {
                        return {
                            copy: ({
                                x,
                                y,
                                z,
                            }: THREE.Vector3 | THREE.Euler) => {
                                const uuid = getUUID(ref, index);
                                uuid &&
                                    worker.setRotation({
                                        props: [x, y, z],
                                        uuid,
                                    });
                            },
                            set: (x: number, y: number, z: number) => {
                                const uuid = getUUID(ref, index);
                                uuid &&
                                    worker.setRotation({
                                        props: [x, y, z],
                                        uuid,
                                    });
                            },
                            subscribe: (
                                callback: (value: NgtTriple) => void
                            ) => {
                                const id = incrementingId++;
                                const target = 'bodies';
                                const type = 'quaternion';
                                const uuid = getUUID(ref, index);

                                subscriptions[id] = {
                                    [type]: quaternionToRotation(callback),
                                };
                                uuid &&
                                    worker.subscribe({
                                        props: { id, target, type },
                                        uuid,
                                    });
                                return () => {
                                    delete subscriptions[id];
                                    worker.unsubscribe({ props: id });
                                };
                            },
                        };
                    };

                    const makeVec = (type: VectorName, index?: number) => {
                        const op: SetOpName<VectorName> = `set${capitalize(
                            type
                        )}`;
                        return {
                            copy: ({
                                x,
                                y,
                                z,
                            }: THREE.Vector3 | THREE.Euler) => {
                                const uuid = getUUID(ref, index);
                                uuid && worker[op]({ props: [x, y, z], uuid });
                            },
                            set: (x: number, y: number, z: number) => {
                                const uuid = getUUID(ref, index);
                                uuid && worker[op]({ props: [x, y, z], uuid });
                            },
                            subscribe: subscribe(
                                ref,
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
                            applyForce(
                                force: NgtTriple,
                                worldPoint: NgtTriple
                            ) {
                                const uuid = getUUID(ref, index);
                                uuid &&
                                    worker.applyForce({
                                        props: [force, worldPoint],
                                        uuid,
                                    });
                            },
                            applyImpulse(
                                impulse: NgtTriple,
                                worldPoint: NgtTriple
                            ) {
                                const uuid = getUUID(ref, index);
                                uuid &&
                                    worker.applyImpulse({
                                        props: [impulse, worldPoint],
                                        uuid,
                                    });
                            },
                            applyLocalForce(
                                force: NgtTriple,
                                localPoint: NgtTriple
                            ) {
                                const uuid = getUUID(ref, index);
                                uuid &&
                                    worker.applyLocalForce({
                                        props: [force, localPoint],
                                        uuid,
                                    });
                            },
                            applyLocalImpulse(
                                impulse: NgtTriple,
                                localPoint: NgtTriple
                            ) {
                                const uuid = getUUID(ref, index);
                                uuid &&
                                    worker.applyLocalImpulse({
                                        props: [impulse, localPoint],
                                        uuid,
                                    });
                            },
                            applyTorque(torque: NgtTriple) {
                                const uuid = getUUID(ref, index);
                                uuid &&
                                    worker.applyTorque({
                                        props: [torque],
                                        uuid,
                                    });
                            },
                            collisionFilterGroup: makeAtomic(
                                'collisionFilterGroup',
                                index
                            ),
                            collisionFilterMask: makeAtomic(
                                'collisionFilterMask',
                                index
                            ),
                            collisionResponse: makeAtomic(
                                'collisionResponse',
                                index
                            ),
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
                                const uuid = getUUID(ref, index);
                                if (uuid)
                                    scaleOverrides[uuid] = new THREE.Vector3(
                                        ...scale
                                    );
                            },
                            sleep() {
                                const uuid = getUUID(ref, index);
                                uuid && worker.sleep({ uuid });
                            },
                            sleepSpeedLimit: makeAtomic(
                                'sleepSpeedLimit',
                                index
                            ),
                            sleepTimeLimit: makeAtomic('sleepTimeLimit', index),
                            userData: makeAtomic('userData', index),
                            velocity: makeVec('velocity', index),
                            wakeUp() {
                                const uuid = getUUID(ref, index);
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
                },
            };
        });
    }
}
