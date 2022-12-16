import { injectNgtcPhysicsStore, NgtPhysicsUtils } from '@angular-three/cannon';
import { injectNgtcDebugApi } from '@angular-three/cannon/debug';
import { is } from '@angular-three/core';
import { ChangeDetectorRef, ElementRef, inject, ViewRef } from '@angular/core';
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
  Quad,
  SetOpName,
  SphereArgs,
  SphereProps,
  TrimeshProps,
  Triplet,
  VectorName,
} from '@pmndrs/cannon-worker-api';
import { DynamicDrawUsage, Euler, InstancedMesh, Object3D, Quaternion, Vector3 } from 'three';
import type { StoreApi } from 'zustand/vanilla';

//
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
  ref: ElementRef<TObject>;
  api: () => NgtPhysicsBodyPublicApi;
}

export type NgtGetByIndex<T extends BodyProps> = (index: number) => T | StoreApi<T>;
export type NgtArgFn<T> = (args: T) => unknown[];

export function injectPlane<TObject extends THREE.Object3D>(
  fn: NgtGetByIndex<PlaneProps>,
  ref?: ElementRef<TObject>
) {
  return injectBody<PlaneProps, TObject>('Plane', fn, () => [], ref);
}

export function injectBox<TObject extends THREE.Object3D>(
  fn: NgtGetByIndex<BoxProps>,
  ref?: ElementRef<TObject>
) {
  const defaultBoxArgs: Triplet = [1, 1, 1];
  return injectBody<BoxProps, TObject>('Box', fn, (args = defaultBoxArgs): Triplet => args, ref);
}

export function injectCylinder<TObject extends THREE.Object3D>(
  fn: NgtGetByIndex<CylinderProps>,
  ref?: ElementRef<TObject>
) {
  return injectBody<CylinderProps, TObject>('Cylinder', fn, (args = [] as []) => args, ref);
}

export function injectHeightfield<TObject extends THREE.Object3D>(
  fn: NgtGetByIndex<HeightfieldProps>,
  ref?: ElementRef<TObject>
) {
  return injectBody<HeightfieldProps, TObject>('Heightfield', fn, (args) => args, ref);
}

export function injectParticle<TObject extends THREE.Object3D>(
  fn: NgtGetByIndex<ParticleProps>,
  ref?: ElementRef<TObject>
) {
  return injectBody<ParticleProps, TObject>('Particle', fn, () => [], ref);
}

export function injectSphere<TObject extends THREE.Object3D>(
  fn: NgtGetByIndex<SphereProps>,
  ref?: ElementRef<TObject>
) {
  return injectBody<SphereProps, TObject>(
    'Sphere',
    fn,
    (args: SphereArgs = [1]): SphereArgs => {
      if (!Array.isArray(args)) throw new Error('injectSphere args must be an array');
      return [args[0]];
    },
    ref
  );
}

export function injectTrimesh<TObject extends THREE.Object3D>(
  fn: NgtGetByIndex<TrimeshProps>,
  ref?: ElementRef<TObject>
) {
  return injectBody<TrimeshProps, TObject>('Trimesh', fn, (args) => args, ref);
}

export function injectConvexPolyhedron<TObject extends THREE.Object3D>(
  fn: NgtGetByIndex<ConvexPolyhedronProps>,
  ref?: ElementRef<TObject>
) {
  return injectBody<ConvexPolyhedronProps, TObject>(
    'ConvexPolyhedron',
    fn,
    ([
      vertices,
      faces,
      normals,
      axes,
      boundingSphereRadius,
    ] = []): ConvexPolyhedronArgs<Triplet> => [
      vertices && vertices.map(NgtPhysicsUtils.makeTriplet),
      faces,
      normals && normals.map(NgtPhysicsUtils.makeTriplet),
      axes && axes.map(NgtPhysicsUtils.makeTriplet),
      boundingSphereRadius,
    ],
    ref
  );
}

export function injectCompoundBody<TObject extends THREE.Object3D>(
  fn: NgtGetByIndex<CompoundBodyProps>,
  ref?: ElementRef<TObject>
) {
  return injectBody<CompoundBodyProps, TObject>('Compound', fn, (args) => args as unknown[], ref);
}

const temp = new Object3D();

function injectBody<TBodyProps extends BodyProps, TObject extends THREE.Object3D>(
  type: BodyShapeType,
  getPropsFn: NgtGetByIndex<TBodyProps>,
  argsFn: NgtArgFn<TBodyProps['args']>,
  instanceRef?: ElementRef<TObject>
): NgtPhysicBodyReturn<TObject> {
  const view = inject(ChangeDetectorRef) as ViewRef;
  const debugApi = injectNgtcDebugApi({ skipSelf: true, optional: true });
  const { store } = injectNgtcPhysicsStore({ skipSelf: true });

  let ref = new ElementRef<TObject>(null!);

  if (instanceRef) {
    ref = instanceRef;
  }

  queueMicrotask(() => {
    const { events, refs, worker } = store.getState();

    if (!ref?.nativeElement) {
      ref.nativeElement = new Object3D() as TObject;
    }

    const object = ref.nativeElement;
    const currentWorker = worker;

    let objectCount = 1;

    if (object instanceof InstancedMesh) {
      object.instanceMatrix.setUsage(DynamicDrawUsage);
      objectCount = object.count;
    }

    const uuids =
      object instanceof InstancedMesh
        ? new Array(objectCount).fill(0).map((_, i) => `${object.uuid}/${i}`)
        : [object.uuid];

    const props: (TBodyProps & { args: unknown })[] =
      object instanceof InstancedMesh
        ? uuids.map((id, i) => {
            let props = getPropsFn(i);
            props = is.store(props) ? props.getState() : props;
            NgtPhysicsUtils.prepare(temp, props);
            object.setMatrixAt(i, temp.matrix);
            object.instanceMatrix.needsUpdate = true;
            refs[id] = object;
            debugApi?.add(id, props, type);
            NgtPhysicsUtils.setupCollision(events, props, id);
            return { ...props, args: argsFn(props.args) };
          })
        : uuids.map((id, i) => {
            let props = getPropsFn(i);
            props = is.store(props) ? props.getState() : props;
            NgtPhysicsUtils.prepare(object, props);
            refs[id] = object;
            debugApi?.add(id, props, type);
            NgtPhysicsUtils.setupCollision(events, props, id);
            return { ...props, args: argsFn(props.args) };
          });

    currentWorker.addBodies({
      props: props.map(({ onCollide, onCollideBegin, onCollideEnd, ...serializableProps }) => ({
        onCollide: Boolean(onCollide),
        onCollideBegin: Boolean(onCollideBegin),
        onCollideEnd: Boolean(onCollideEnd),
        ...serializableProps,
      })),
      type,
      uuid: uuids,
    });

    queueMicrotask(() => {
      view.onDestroy(() => {
        uuids.forEach((id) => {
          delete refs[id];
          debugApi?.remove(id);
          delete events[id];
        });
        currentWorker.removeBodies({ uuid: uuids });
      });
    });
  });

  const api = () => {
    const { scaleOverrides, subscriptions, worker } = store.getState();

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
        copy: ({ w, x, y, z }: Quaternion) => {
          const uuid = NgtPhysicsUtils.getUUID(ref, index);
          uuid && worker.setQuaternion({ props: [x, y, z, w], uuid });
        },
        set: (x: number, y: number, z: number, w: number) => {
          const uuid = NgtPhysicsUtils.getUUID(ref, index);
          uuid && worker.setQuaternion({ props: [x, y, z, w], uuid });
        },
        subscribe: NgtPhysicsUtils.subscribe(ref, worker, subscriptions, type, index),
      };
    };

    const makeRotation = (index?: number) => {
      return {
        copy: ({ x, y, z }: Vector3 | Euler) => {
          const uuid = NgtPhysicsUtils.getUUID(ref, index);
          uuid && worker.setRotation({ props: [x, y, z], uuid });
        },
        set: (x: number, y: number, z: number) => {
          const uuid = NgtPhysicsUtils.getUUID(ref, index);
          uuid && worker.setRotation({ props: [x, y, z], uuid });
        },
        subscribe: (callback: (value: Triplet) => void) => {
          const id = NgtPhysicsUtils.incrementingId++;
          const target = 'bodies';
          const type = 'quaternion';
          const uuid = NgtPhysicsUtils.getUUID(ref, index);

          subscriptions[id] = { [type]: NgtPhysicsUtils.quaternionToRotation(callback) };
          uuid && worker.subscribe({ props: { id, target, type }, uuid });
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
        copy: ({ x, y, z }: Vector3 | Euler) => {
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
        applyForce(force: Triplet, worldPoint: Triplet) {
          const uuid = NgtPhysicsUtils.getUUID(ref, index);
          uuid && worker.applyForce({ props: [force, worldPoint], uuid });
        },
        applyImpulse(impulse: Triplet, worldPoint: Triplet) {
          const uuid = NgtPhysicsUtils.getUUID(ref, index);
          uuid && worker.applyImpulse({ props: [impulse, worldPoint], uuid });
        },
        applyLocalForce(force: Triplet, localPoint: Triplet) {
          const uuid = NgtPhysicsUtils.getUUID(ref, index);
          uuid && worker.applyLocalForce({ props: [force, localPoint], uuid });
        },
        applyLocalImpulse(impulse: Triplet, localPoint: Triplet) {
          const uuid = NgtPhysicsUtils.getUUID(ref, index);
          uuid && worker.applyLocalImpulse({ props: [impulse, localPoint], uuid });
        },
        applyTorque(torque: Triplet) {
          const uuid = NgtPhysicsUtils.getUUID(ref, index);
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
        remove: makeRemove(index),
        rotation: makeRotation(index),
        scaleOverride(scale) {
          const uuid = NgtPhysicsUtils.getUUID(ref, index);
          if (uuid) scaleOverrides[uuid] = new Vector3(...scale);
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
  };

  return { ref, api };
}
