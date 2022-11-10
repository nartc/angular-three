import { NgtPhysicsStore, NgtPhysicsUtils } from '@angular-three/cannon';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { NgtDebug } from '@angular-three/cannon/debug';
import {
  applyProps,
  checkNeedsUpdate,
  make,
  NgtComponentStore,
  NgtObservableInput,
  NgtRef,
  NgtStore,
  NgtUnknownRecord,
  prepare,
  skipFirstUndefined,
  tapEffect,
} from '@angular-three/core';
import { inject, Injectable, NgZone } from '@angular/core';
import {
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
  Quad,
  SetOpName,
  SphereArgs,
  SphereProps,
  TrimeshProps,
  Triplet,
  VectorName,
} from '@pmndrs/cannon-worker-api';
import { combineLatest, filter, isObservable, map, Observable, of } from 'rxjs';
import * as THREE from 'three';

export type NgtAtomicApi<K extends AtomicName> = {
  set: (value: AtomicProps[K]) => void;
  subscribe: (callback: (value: AtomicProps[K]) => void) => () => void;
};

export type NgtQuaternionApi = {
  copy: ({ w, x, y, z }: THREE.Quaternion) => void;
  set: (x: number, y: number, z: number, w: number) => void;
  subscribe: (callback: (value: Quad) => void) => () => void;
};

export type NgtVectorApi = {
  copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => void;
  set: (x: number, y: number, z: number) => void;
  subscribe: (callback: (value: Triplet) => void) => () => void;
};

export type NgtWorkerApi = {
  [K in AtomicName]: NgtAtomicApi<K>;
} & {
  [K in VectorName]: NgtVectorApi;
} & {
  applyForce: (force: Triplet, worldPoint: Triplet) => void;
  applyImpulse: (impulse: Triplet, worldPoint: Triplet) => void;
  applyLocalForce: (force: Triplet, localPoint: Triplet) => void;
  applyLocalImpulse: (impulse: Triplet, localPoint: Triplet) => void;
  applyTorque: (torque: Triplet) => void;
  quaternion: NgtQuaternionApi;
  rotation: NgtVectorApi;
  scaleOverride: (scale: Triplet) => void;
  sleep: () => void;
  wakeUp: () => void;
  remove: () => void;
};

export interface NgtPhysicsBodyPublicApi extends NgtWorkerApi {
  at: (index: number) => NgtWorkerApi;
}

export interface NgtPhysicBodyReturn<TObject extends THREE.Object3D> {
  ref: NgtRef<TObject>;
  api: NgtPhysicsBodyPublicApi;
}

export type NgtGetByIndex<T extends BodyProps> = (index: number) => NgtObservableInput<T>;
export type NgtArgFn<T> = (args: T) => unknown[];

type PropsToProcess<TBodyProps> = [uuid: string, bodyProps: TBodyProps];

function getPropsToProcess<TBodyProps extends BodyProps>(
  uuid: string,
  bodyProps: TBodyProps
): PropsToProcess<TBodyProps> {
  return [uuid, bodyProps];
}

const temp = new THREE.Object3D();

function applyBodyProps<TBodyProps extends BodyProps, TObject extends THREE.Object3D = THREE.Object3D>(
  ref: NgtRef<TObject>,
  props: TBodyProps
) {
  const objectProps: NgtUnknownRecord = {};
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

  applyProps(ref.value, objectProps);
}
@Injectable()
export class NgtPhysicsBody extends NgtComponentStore {
  private readonly zone = inject(NgZone);
  private readonly store = inject(NgtStore);
  private readonly physicsStore = inject(NgtPhysicsStore, { skipSelf: true });
  private readonly debug = inject(NgtDebug, { skipSelf: true, optional: true });

  usePlane<TObject extends THREE.Object3D>(fn: NgtGetByIndex<PlaneProps>, useOnTemplate = true, ref?: NgtRef<TObject>) {
    return this.useBody<PlaneProps, TObject>('Plane', fn, () => [], useOnTemplate, ref);
  }

  useBox<TObject extends THREE.Object3D>(fn: NgtGetByIndex<BoxProps>, useOnTemplate = true, ref?: NgtRef<TObject>) {
    const defaultBoxArgs: Triplet = [1, 1, 1];
    return this.useBody<BoxProps, TObject>('Box', fn, (args = defaultBoxArgs): Triplet => args, useOnTemplate, ref);
  }

  useCylinder<TObject extends THREE.Object3D>(
    fn: NgtGetByIndex<CylinderProps>,
    useOnTemplate = true,
    ref?: NgtRef<TObject>
  ) {
    return this.useBody<CylinderProps, TObject>('Cylinder', fn, (args = [] as []) => args, useOnTemplate, ref);
  }

  useHeightfield<TObject extends THREE.Object3D>(
    fn: NgtGetByIndex<HeightfieldProps>,
    useOnTemplate = true,
    ref?: NgtRef<TObject>
  ) {
    return this.useBody<HeightfieldProps, TObject>('Heightfield', fn, (args) => args, useOnTemplate, ref);
  }

  useParticle<TObject extends THREE.Object3D>(
    fn: NgtGetByIndex<ParticleProps>,
    useOnTemplate = true,
    ref?: NgtRef<TObject>
  ) {
    return this.useBody<ParticleProps, TObject>('Particle', fn, () => [], useOnTemplate, ref);
  }

  useSphere<TObject extends THREE.Object3D>(
    fn: NgtGetByIndex<SphereProps>,
    useOnTemplate = true,
    ref?: NgtRef<TObject>
  ) {
    return this.useBody<SphereProps, TObject>(
      'Sphere',
      fn,
      (args: SphereArgs = [1]): SphereArgs => {
        if (!Array.isArray(args)) throw new Error('useSphere args must be an array');
        return [args[0]];
      },
      useOnTemplate,
      ref
    );
  }

  useTrimesh<TObject extends THREE.Object3D>(
    fn: NgtGetByIndex<TrimeshProps>,
    useOnTemplate = true,
    ref?: NgtRef<TObject>
  ) {
    return this.useBody<TrimeshProps, TObject>('Trimesh', fn, (args) => args, useOnTemplate, ref);
  }

  useConvexPolyhedron<TObject extends THREE.Object3D>(
    fn: NgtGetByIndex<ConvexPolyhedronProps>,
    useOnTemplate = true,
    ref?: NgtRef<TObject>
  ) {
    return this.useBody<ConvexPolyhedronProps, TObject>(
      'ConvexPolyhedron',
      fn,
      ([vertices, faces, normals, axes, boundingSphereRadius] = []): ConvexPolyhedronArgs<Triplet> => [
        vertices && vertices.map(NgtPhysicsUtils.makeTriplet),
        faces,
        normals && normals.map(NgtPhysicsUtils.makeTriplet),
        axes && axes.map(NgtPhysicsUtils.makeTriplet),
        boundingSphereRadius,
      ],
      useOnTemplate,
      ref
    );
  }

  useCompoundBody<TObject extends THREE.Object3D>(
    fn: NgtGetByIndex<CompoundBodyProps>,
    useOnTemplate = true,
    ref?: NgtRef<TObject>
  ) {
    return this.useBody<CompoundBodyProps, TObject>('Compound', fn, (args) => args as unknown[], useOnTemplate, ref);
  }

  private useBody<TBodyProps extends BodyProps, TObject extends THREE.Object3D>(
    type: BodyShapeType,
    getPropsFn: NgtGetByIndex<TBodyProps>,
    argsFn: NgtArgFn<TBodyProps['args']>,
    useOnTemplate = true,
    instanceRef?: NgtRef<TObject>
  ) {
    return this.zone.runOutsideAngular(() => {
      let ref = instanceRef as NgtRef<TObject>;

      if (!ref) {
        ref = new NgtRef<TObject>();
      }

      if (!ref.value && !useOnTemplate) {
        ref.set(prepare(new THREE.Object3D() as TObject, this.store.getState, this.store.rootStateGetter));
      }

      const physicsStore = this.physicsStore;

      this.store.onReady(() => {
        this.effect(
          tapEffect(() => {
            const { worker, refs, events } = physicsStore.getState();
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

            const cleanUp = () => {
              uuid.forEach((id) => {
                delete refs[id];
                if (this.debug) {
                  this.debug.api.remove(id);
                }
                delete events[id];
              });
              worker.removeBodies({ uuid });
            };

            const [props, hasObservable] = uuid.reduce(
              (accumulator, id, index) => {
                const prop = getPropsFn(index);
                if (!accumulator[1] && isObservable(prop)) {
                  accumulator[1] = true;
                }
                accumulator[0].push([id, prop]);
                return accumulator;
              },
              [[], false] as [Array<PropsToProcess<NgtObservableInput<TBodyProps>>>, boolean]
            );

            let propsToProcess: Observable<Array<PropsToProcess<TBodyProps>>> = of(
              props as Array<PropsToProcess<TBodyProps>>
            );
            if (hasObservable) {
              propsToProcess = combineLatest(
                props.map(([uuid, prop]) => {
                  return isObservable(prop)
                    ? prop.pipe(map((value) => getPropsToProcess(uuid, value)))
                    : of(getPropsToProcess(uuid, prop as TBodyProps));
                })
              );
            }

            const propsAndArgs$ = propsToProcess.pipe(
              map((props) =>
                props.map(([uuid, bodyProps], i) => {
                  NgtPhysicsUtils.prepare(temp, bodyProps);
                  if (object instanceof THREE.InstancedMesh) {
                    object.setMatrixAt(i, temp.matrix);
                    checkNeedsUpdate(object.instanceMatrix);
                  }

                  refs[uuid] = object;

                  if (this.debug) {
                    this.debug.api.add(uuid, bodyProps, type);
                  }

                  NgtPhysicsUtils.setupCollision(events, bodyProps, uuid);

                  // if (!(object instanceof THREE.InstancedMesh)) {
                  //   applyBodyProps(ref, bodyProps);
                  // }

                  return {
                    ...bodyProps,
                    args: argsFn(bodyProps.args),
                  };
                })
              )
            );

            this.effect(
              tapEffect((propsAndArgs: Array<TBodyProps & { args: unknown[] }>) => {
                worker.addBodies({
                  props: propsAndArgs.map(({ onCollide, onCollideBegin, onCollideEnd, ...serializableProps }) => ({
                    onCollide: Boolean(onCollide),
                    onCollideBegin: Boolean(onCollideBegin),
                    onCollideEnd: Boolean(onCollideEnd),
                    ...serializableProps,
                  })),
                  type,
                  uuid,
                });
                return cleanUp;
              })
            )(propsAndArgs$);

            return cleanUp;
          })
        )(
          this.select(
            this.physicsStore.select((s) => s.worker).pipe(skipFirstUndefined()),
            ref.pipe(filter((v) => !!v)),
            this.defaultProjector
          )
        );
      });

      return {
        ref,
        get api() {
          const { worker, subscriptions, scaleOverrides } = physicsStore.getState();

          const makeAtomic = <T extends AtomicName>(type: T, index?: number) => {
            const op: SetOpName<T> = `set${NgtPhysicsUtils.capitalize(type)}`;

            return {
              set: (value: PropValue<T>) => {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid &&
                  worker[op]({
                    props: value,
                    uuid,
                  } as never);
              },
              subscribe: NgtPhysicsUtils.subscribe(ref, worker, subscriptions, type, index),
            };
          };

          const makeQuaternion = (index?: number) => {
            const type = 'quaternion';
            return {
              copy: ({ w, x, y, z }: THREE.Quaternion) => {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid &&
                  worker.setQuaternion({
                    props: [x, y, z, w],
                    uuid,
                  });
              },
              set: (x: number, y: number, z: number, w: number) => {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid &&
                  worker.setQuaternion({
                    props: [x, y, z, w],
                    uuid,
                  });
              },
              subscribe: NgtPhysicsUtils.subscribe(ref, worker, subscriptions, type, index),
            };
          };

          const makeRotation = (index?: number) => {
            return {
              copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid &&
                  worker.setRotation({
                    props: [x, y, z],
                    uuid,
                  });
              },
              set: (x: number, y: number, z: number) => {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid &&
                  worker.setRotation({
                    props: [x, y, z],
                    uuid,
                  });
              },
              subscribe: (callback: (value: Triplet) => void) => {
                const id = NgtPhysicsUtils.incrementingId++;
                const target = 'bodies';
                const type = 'quaternion';
                const uuid = NgtPhysicsUtils.getUUID(ref, index);

                subscriptions[id] = {
                  [type]: NgtPhysicsUtils.quaternionToRotation(callback),
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
            const op: SetOpName<VectorName> = `set${NgtPhysicsUtils.capitalize(type)}`;
            return {
              copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid && worker[op]({ props: [x, y, z], uuid });
              },
              set: (x: number, y: number, z: number) => {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid && worker[op]({ props: [x, y, z], uuid });
              },
              subscribe: NgtPhysicsUtils.subscribe(ref, worker, subscriptions, type, index),
            };
          };

          const makeRemove = (index?: number) => {
            const uuid = NgtPhysicsUtils.getUUID(ref, index);
            return () => {
              if (uuid) {
                worker.removeBodies({ uuid: [uuid] });
              }
            };
          };

          function makeApi(index?: number): NgtWorkerApi {
            return {
              allowSleep: makeAtomic('allowSleep', index),
              angularDamping: makeAtomic('angularDamping', index),
              angularFactor: makeVec('angularFactor', index),
              angularVelocity: makeVec('angularVelocity', index),
              remove: makeRemove(index),
              applyForce(force: Triplet, worldPoint: Triplet) {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid &&
                  worker.applyForce({
                    props: [force, worldPoint],
                    uuid,
                  });
              },
              applyImpulse(impulse: Triplet, worldPoint: Triplet) {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid &&
                  worker.applyImpulse({
                    props: [impulse, worldPoint],
                    uuid,
                  });
              },
              applyLocalForce(force: Triplet, localPoint: Triplet) {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid &&
                  worker.applyLocalForce({
                    props: [force, localPoint],
                    uuid,
                  });
              },
              applyLocalImpulse(impulse: Triplet, localPoint: Triplet) {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid &&
                  worker.applyLocalImpulse({
                    props: [impulse, localPoint],
                    uuid,
                  });
              },
              applyTorque(torque: Triplet) {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
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
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                if (uuid) scaleOverrides[uuid] = new THREE.Vector3(...scale);
              },
              sleep() {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid && worker.sleep({ uuid });
              },
              sleepSpeedLimit: makeAtomic('sleepSpeedLimit', index),
              sleepTimeLimit: makeAtomic('sleepTimeLimit', index),
              userData: makeAtomic('userData', index),
              velocity: makeVec('velocity', index),
              wakeUp() {
                const uuid = NgtPhysicsUtils.getUUID(ref, index);
                uuid && worker.wakeUp({ uuid });
              },
            };
          }

          const cache: { [index: number]: NgtWorkerApi } = {};
          return {
            ...makeApi(undefined),
            at: (index: number) => cache[index] || (cache[index] = makeApi(index)),
          };
        },
      };
    });
  }
}
