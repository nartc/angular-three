import {
  applyProps,
  checkNeedsUpdate,
  is,
  make,
  NgtComponentStore,
  NgtQuadruple,
  NgtStore,
  NgtTriple,
  NgtUnknownInstance,
  prepare as prepareInstance,
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
  TrimeshProps,
  VectorName,
} from '@pmndrs/cannon-worker-api';
import { CannonWorkerAPI } from '@pmndrs/cannon-worker-api';
import { combineLatest, filter } from 'rxjs';
import * as THREE from 'three';
import { NgtCannonDebug } from './debug';
import type { CannonEvents } from './physics.store';
import { NgtPhysicsStore } from './physics.store';
import { NgtCannonUtils } from './utils';

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
  remove: () => void;
};

export interface NgtPhysicsBodyPublicApi extends WorkerApi {
  at: (index: number) => WorkerApi;
}

export interface NgtPhysicBodyReturn<TObject extends THREE.Object3D> {
  ref: Ref<TObject>;
  api: NgtPhysicsBodyPublicApi;
}

export type GetByIndex<T extends BodyProps> = (index: number) => T;
type ArgFn<T> = (args: T) => unknown[];

const temp = new THREE.Object3D();

function applyBodyProps<TBodyProps extends BodyProps, TObject extends THREE.Object3D = THREE.Object3D>(
  ref: Ref<TObject>,
  props: TBodyProps
) {
  const objectProps: UnknownRecord = {};
  if (props.position) {
    objectProps['position'] = make(THREE.Vector3, props.position);
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

const e = new THREE.Euler();
const q = new THREE.Quaternion();

const quaternionToRotation = (callback: (v: NgtTriple) => void) => {
  return (v: NgtQuadruple) => callback(e.setFromQuaternion(q.fromArray(v)).toArray() as NgtTriple);
};

function prepare(object: THREE.Object3D, { position = [0, 0, 0], rotation = [0, 0, 0], userData = {} }: BodyProps) {
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
      throw new Error('NgtPhysicBody must be used inside of <ngt-physics>');
    }

    super();
  }

  usePlane<TObject extends THREE.Object3D>(fn: GetByIndex<PlaneProps>, useOnTemplate = true, ref?: Ref<TObject>) {
    return this.useBody<PlaneProps, TObject>('Plane', fn, () => [], useOnTemplate, ref);
  }

  useBox<TObject extends THREE.Object3D>(fn: GetByIndex<BoxProps>, useOnTemplate = true, ref?: Ref<TObject>) {
    const defaultBoxArgs: NgtTriple = [1, 1, 1];
    return this.useBody<BoxProps, TObject>('Box', fn, (args = defaultBoxArgs): NgtTriple => args, useOnTemplate, ref);
  }

  useCylinder<TObject extends THREE.Object3D>(fn: GetByIndex<CylinderProps>, useOnTemplate = true, ref?: Ref<TObject>) {
    return this.useBody<CylinderProps, TObject>('Cylinder', fn, (args = [] as []) => args, useOnTemplate, ref);
  }

  useHeightfield<TObject extends THREE.Object3D>(
    fn: GetByIndex<HeightfieldProps>,
    useOnTemplate = true,
    ref?: Ref<TObject>
  ) {
    return this.useBody<HeightfieldProps, TObject>('Heightfield', fn, (args) => args, useOnTemplate, ref);
  }

  useParticle<TObject extends THREE.Object3D>(fn: GetByIndex<ParticleProps>, useOnTemplate = true, ref?: Ref<TObject>) {
    return this.useBody<ParticleProps, TObject>('Particle', fn, () => [], useOnTemplate, ref);
  }

  useSphere<TObject extends THREE.Object3D>(fn: GetByIndex<SphereProps>, useOnTemplate = true, ref?: Ref<TObject>) {
    return this.useBody<SphereProps, TObject>(
      'Sphere',
      fn,
      (args: SphereArgs = [1]): SphereArgs => {
        if (!is.arr(args)) throw new Error('useSphere args must be an array');
        return [args[0]];
      },
      useOnTemplate,
      ref
    );
  }

  useTrimesh<TObject extends THREE.Object3D>(fn: GetByIndex<TrimeshProps>, useOnTemplate = true, ref?: Ref<TObject>) {
    return this.useBody<TrimeshProps, TObject>('Trimesh', fn, (args) => args, useOnTemplate, ref);
  }

  useConvexPolyhedron<TObject extends THREE.Object3D>(
    fn: GetByIndex<ConvexPolyhedronProps>,
    useOnTemplate = true,
    ref?: Ref<TObject>
  ) {
    return this.useBody<ConvexPolyhedronProps, TObject>(
      'ConvexPolyhedron',
      fn,
      ([vertices, faces, normals, axes, boundingSphereRadius] = []): ConvexPolyhedronArgs<NgtTriple> => [
        vertices && vertices.map(makeTriplet),
        faces,
        normals && normals.map(makeTriplet),
        axes && axes.map(makeTriplet),
        boundingSphereRadius,
      ],
      useOnTemplate,
      ref
    );
  }

  useCompoundBody<TObject extends THREE.Object3D>(
    fn: GetByIndex<CompoundBodyProps>,
    useOnTemplate = true,
    ref?: Ref<TObject>
  ) {
    return this.useBody<CompoundBodyProps, TObject>('Compound', fn, (args) => args as unknown[], useOnTemplate, ref);
  }

  private useBody<TBodyProps extends BodyProps, TObject extends THREE.Object3D>(
    type: BodyShapeType,
    getPropsFn: GetByIndex<TBodyProps>,
    argsFn: ArgFn<TBodyProps['args']>,
    useOnTemplate = true,
    instanceRef?: Ref<TObject>
  ): NgtPhysicBodyReturn<TObject> {
    return this.zone.runOutsideAngular(() => {
      let ref = instanceRef as Ref<TObject>;

      if (!ref) {
        ref = new Ref<TObject>();
      }

      if (!ref.value && !useOnTemplate) {
        ref.set(prepareInstance(new THREE.Object3D() as TObject, () => this.store.get()));
      }

      const physicsStore = this.physicsStore;

      this.store.onReady(() => {
        this.effect<[CannonWorkerAPI, THREE.Object3D]>(
          tapEffect(() => {
            const { worker, refs, events } = physicsStore.get();
            const object = ref.value;
            let objectCount = 1;

            if (object instanceof THREE.InstancedMesh) {
              object.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
              objectCount = object.count;
            }

            const uuid =
              object instanceof THREE.InstancedMesh
                ? new Array(objectCount).fill(0).map((_, i) => `${object.uuid}/${i}`)
                : [object.uuid];

            const props: (TBodyProps & { args: unknown })[] = uuid.map((id, i) => {
              const props = getPropsFn(i);
              prepare(temp, props);
              if (object instanceof THREE.InstancedMesh) {
                object.setMatrixAt(i, temp.matrix);
                checkNeedsUpdate(object.instanceMatrix);
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
              props: props.map(({ onCollide, onCollideBegin, onCollideEnd, ...serializableProps }) => {
                return {
                  onCollide: Boolean(onCollide),
                  onCollideBegin: Boolean(onCollideBegin),
                  onCollideEnd: Boolean(onCollideEnd),
                  ...serializableProps,
                };
              }),
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
        )(combineLatest([physicsStore.select((s) => s.worker), ref.pipe(filter((obj): obj is TObject => !!obj))]));
      });

      return {
        ref,
        get api() {
          const { worker, subscriptions, scaleOverrides } = physicsStore.get();

          const makeAtomic = <T extends AtomicName>(type: T, index?: number) => {
            const op: SetOpName<T> = `set${capitalize(type)}`;

            return {
              set: (value: PropValue<T>) => {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid &&
                  worker[op]({
                    props: value,
                    uuid,
                  } as never);
              },
              subscribe: NgtCannonUtils.subscribe(ref, worker, subscriptions, type, index),
            };
          };

          const makeQuaternion = (index?: number) => {
            const type = 'quaternion';
            return {
              copy: ({ w, x, y, z }: THREE.Quaternion) => {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid &&
                  worker.setQuaternion({
                    props: [x, y, z, w],
                    uuid,
                  });
              },
              set: (x: number, y: number, z: number, w: number) => {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid &&
                  worker.setQuaternion({
                    props: [x, y, z, w],
                    uuid,
                  });
              },
              subscribe: NgtCannonUtils.subscribe(ref, worker, subscriptions, type, index),
            };
          };

          const makeRotation = (index?: number) => {
            return {
              copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid &&
                  worker.setRotation({
                    props: [x, y, z],
                    uuid,
                  });
              },
              set: (x: number, y: number, z: number) => {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid &&
                  worker.setRotation({
                    props: [x, y, z],
                    uuid,
                  });
              },
              subscribe: (callback: (value: NgtTriple) => void) => {
                const id = NgtCannonUtils.incrementingId++;
                const target = 'bodies';
                const type = 'quaternion';
                const uuid = NgtCannonUtils.getUUID(ref, index);

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
            const op: SetOpName<VectorName> = `set${capitalize(type)}`;
            return {
              copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid && worker[op]({ props: [x, y, z], uuid });
              },
              set: (x: number, y: number, z: number) => {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid && worker[op]({ props: [x, y, z], uuid });
              },
              subscribe: NgtCannonUtils.subscribe(ref, worker, subscriptions, type, index),
            };
          };

          const makeRemove = (index?: number) => {
            const uuid = NgtCannonUtils.getUUID(ref, index);
            return () => {
              if (uuid) {
                worker.removeBodies({ uuid: [uuid] });
              }
            };
          };

          function makeApi(index?: number): WorkerApi {
            return {
              allowSleep: makeAtomic('allowSleep', index),
              angularDamping: makeAtomic('angularDamping', index),
              angularFactor: makeVec('angularFactor', index),
              angularVelocity: makeVec('angularVelocity', index),
              remove: makeRemove(index),
              applyForce(force: NgtTriple, worldPoint: NgtTriple) {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid &&
                  worker.applyForce({
                    props: [force, worldPoint],
                    uuid,
                  });
              },
              applyImpulse(impulse: NgtTriple, worldPoint: NgtTriple) {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid &&
                  worker.applyImpulse({
                    props: [impulse, worldPoint],
                    uuid,
                  });
              },
              applyLocalForce(force: NgtTriple, localPoint: NgtTriple) {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid &&
                  worker.applyLocalForce({
                    props: [force, localPoint],
                    uuid,
                  });
              },
              applyLocalImpulse(impulse: NgtTriple, localPoint: NgtTriple) {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid &&
                  worker.applyLocalImpulse({
                    props: [impulse, localPoint],
                    uuid,
                  });
              },
              applyTorque(torque: NgtTriple) {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid &&
                  worker.applyTorque({
                    props: [torque],
                    uuid,
                  });
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
                const uuid = NgtCannonUtils.getUUID(ref, index);
                if (uuid) scaleOverrides[uuid] = new THREE.Vector3(...scale);
              },
              sleep() {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid && worker.sleep({ uuid });
              },
              sleepSpeedLimit: makeAtomic('sleepSpeedLimit', index),
              sleepTimeLimit: makeAtomic('sleepTimeLimit', index),
              userData: makeAtomic('userData', index),
              velocity: makeVec('velocity', index),
              wakeUp() {
                const uuid = NgtCannonUtils.getUUID(ref, index);
                uuid && worker.wakeUp({ uuid });
              },
            };
          }

          const cache: { [index: number]: WorkerApi } = {};
          return {
            ...makeApi(undefined),
            at: (index: number) => cache[index] || (cache[index] = makeApi(index)),
          };
        },
      };
    });
  }
}
