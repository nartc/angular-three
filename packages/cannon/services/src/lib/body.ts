import { injectNgtcPhysicsStore, NgtPhysicsUtils } from '@angular-three/cannon';
import { injectNgtcDebugApi } from '@angular-three/cannon/debug';
import { injectNgtDestroy, injectNgtRef, NgtInjectedRef } from '@angular-three/core';
import { ViewRef } from '@angular/core';
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
import { takeUntil } from 'rxjs';
import { DynamicDrawUsage, Euler, InstancedMesh, Object3D, Quaternion, Vector3 } from 'three';

export type NgtcAtomicApi<K extends AtomicName> = {
  set: (value: AtomicProps[K]) => void;
  subscribe: (callback: (value: AtomicProps[K]) => void) => () => void;
};

export type NgtcQuaternionApi = {
  copy: ({ w, x, y, z }: THREE.Quaternion) => void;
  set: (x: number, y: number, z: number, w: number) => void;
  subscribe: (callback: (value: Quad) => void) => () => void;
};

export type NgtcVectorApi = {
  copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => void;
  set: (x: number, y: number, z: number) => void;
  subscribe: (callback: (value: Triplet) => void) => () => void;
};

export type NgtcWorkerApi = {
  [K in AtomicName]: NgtcAtomicApi<K>;
} & {
  [K in VectorName]: NgtcVectorApi;
} & {
  applyForce: (force: Triplet, worldPoint: Triplet) => void;
  applyImpulse: (impulse: Triplet, worldPoint: Triplet) => void;
  applyLocalForce: (force: Triplet, localPoint: Triplet) => void;
  applyLocalImpulse: (impulse: Triplet, localPoint: Triplet) => void;
  applyTorque: (torque: Triplet) => void;
  quaternion: NgtcQuaternionApi;
  rotation: NgtcVectorApi;
  scaleOverride: (scale: Triplet) => void;
  sleep: () => void;
  wakeUp: () => void;
  remove: () => void;
};

export interface NgtcPhysicsBodyPublicApi extends NgtcWorkerApi {
  at: (index: number) => NgtcWorkerApi;
}

export interface NgtcPhysicBodyReturn<TObject extends THREE.Object3D> {
  ref: NgtInjectedRef<TObject>;
  api: NgtcPhysicsBodyPublicApi;
}

export type NgtcGetByIndex<T extends BodyProps> = (index: number) => T;
export type NgtcArgFn<T> = (args: T) => unknown[];

export function injectPlane<TObject extends THREE.Object3D>(
  fn: NgtcGetByIndex<PlaneProps>,
  ref?: NgtInjectedRef<TObject>
) {
  return injectBody<PlaneProps, TObject>('Plane', fn, () => [], ref);
}

export function injectBox<TObject extends THREE.Object3D>(
  fn: NgtcGetByIndex<BoxProps>,
  ref?: NgtInjectedRef<TObject>
) {
  const defaultBoxArgs: Triplet = [1, 1, 1];
  return injectBody<BoxProps, TObject>('Box', fn, (args = defaultBoxArgs): Triplet => args, ref);
}

export function injectCylinder<TObject extends THREE.Object3D>(
  fn: NgtcGetByIndex<CylinderProps>,
  ref?: NgtInjectedRef<TObject>
) {
  return injectBody<CylinderProps, TObject>('Cylinder', fn, (args = [] as []) => args, ref);
}

export function injectHeightfield<TObject extends THREE.Object3D>(
  fn: NgtcGetByIndex<HeightfieldProps>,
  ref?: NgtInjectedRef<TObject>
) {
  return injectBody<HeightfieldProps, TObject>('Heightfield', fn, (args) => args, ref);
}

export function injectParticle<TObject extends THREE.Object3D>(
  fn: NgtcGetByIndex<ParticleProps>,
  ref?: NgtInjectedRef<TObject>
) {
  return injectBody<ParticleProps, TObject>('Particle', fn, () => [], ref);
}

export function injectSphere<TObject extends THREE.Object3D>(
  fn: NgtcGetByIndex<SphereProps>,
  ref?: NgtInjectedRef<TObject>
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
  fn: NgtcGetByIndex<TrimeshProps>,
  ref?: NgtInjectedRef<TObject>
) {
  return injectBody<TrimeshProps, TObject>('Trimesh', fn, (args) => args, ref);
}

export function injectConvexPolyhedron<TObject extends THREE.Object3D>(
  fn: NgtcGetByIndex<ConvexPolyhedronProps>,
  ref?: NgtInjectedRef<TObject>
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
  fn: NgtcGetByIndex<CompoundBodyProps>,
  ref?: NgtInjectedRef<TObject>
) {
  return injectBody<CompoundBodyProps, TObject>('Compound', fn, (args) => args as unknown[], ref);
}

const temp = new Object3D();

function injectBody<TBodyProps extends BodyProps, TObject extends THREE.Object3D>(
  type: BodyShapeType,
  getPropsFn: NgtcGetByIndex<TBodyProps>,
  argsFn: NgtcArgFn<TBodyProps['args']>,
  instanceRef?: NgtInjectedRef<TObject>
): NgtcPhysicBodyReturn<TObject> {
  const [destroy$, cdr] = injectNgtDestroy();
  const debugApi = injectNgtcDebugApi({ skipSelf: true, optional: true });
  const store = injectNgtcPhysicsStore({ skipSelf: true });

  let ref = injectNgtRef<TObject>();

  if (instanceRef) {
    ref = instanceRef;
  }

  queueMicrotask(() => {
    if (!ref.nativeElement) {
      ref.nativeElement = new Object3D() as TObject;
    }
  });

  ref.$.pipe(takeUntil(destroy$)).subscribe((object) => {
    const { events, refs, worker } = store.get();

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
            const props = getPropsFn(i);
            NgtPhysicsUtils.prepare(temp, props);
            object.setMatrixAt(i, temp.matrix);
            object.instanceMatrix.needsUpdate = true;
            refs[id] = object;
            debugApi?.add(id, props, type);
            NgtPhysicsUtils.setupCollision(events, props, id);
            return { ...props, args: argsFn(props.args) };
          })
        : uuids.map((id, i) => {
            const props = getPropsFn(i);
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

    (cdr as ViewRef).onDestroy(() => {
      uuids.forEach((id) => {
        delete refs[id];
        debugApi?.remove(id);
        delete events[id];
      });
      currentWorker.removeBodies({ uuid: uuids });
    });
  });

  const makeAtomic = <T extends AtomicName>(type: T, index?: number) => {
    const op: SetOpName<T> = `set${NgtPhysicsUtils.capitalize(type)}`;

    return {
      set: (value: PropValue<T>) => {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid &&
          worker[op]({
            props: value,
            uuid,
          } as never);
      },
      get subscribe() {
        const { subscriptions, worker } = store.get();
        return NgtPhysicsUtils.subscribe(ref, worker, subscriptions, type, index);
      },
    };
  };

  const makeQuaternion = (index?: number) => {
    const type = 'quaternion';
    return {
      copy: ({ w, x, y, z }: Quaternion) => {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker.setQuaternion({ props: [x, y, z, w], uuid });
      },
      set: (x: number, y: number, z: number, w: number) => {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker.setQuaternion({ props: [x, y, z, w], uuid });
      },
      get subscribe() {
        const { subscriptions, worker } = store.get();
        return NgtPhysicsUtils.subscribe(ref, worker, subscriptions, type, index);
      },
    };
  };

  const makeRotation = (index?: number) => {
    return {
      copy: ({ x, y, z }: Vector3 | Euler) => {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker.setRotation({ props: [x, y, z], uuid });
      },
      set: (x: number, y: number, z: number) => {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker.setRotation({ props: [x, y, z], uuid });
      },
      subscribe: (callback: (value: Triplet) => void) => {
        const { subscriptions, worker } = store.get();
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
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker[op]({ props: [x, y, z], uuid });
      },
      set: (x: number, y: number, z: number) => {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker[op]({ props: [x, y, z], uuid });
      },
      get subscribe() {
        const { subscriptions, worker } = store.get();
        return NgtPhysicsUtils.subscribe(ref, worker, subscriptions, type, index);
      },
    };
  };

  const makeRemove = (index?: number) => {
    const { worker } = store.get();
    const uuid = NgtPhysicsUtils.getUUID(ref, index);
    return () => {
      if (uuid) {
        worker.removeBodies({ uuid: [uuid] });
      }
    };
  };

  function makeApi(index?: number): NgtcWorkerApi {
    return {
      allowSleep: makeAtomic('allowSleep', index),
      angularDamping: makeAtomic('angularDamping', index),
      angularFactor: makeVec('angularFactor', index),
      angularVelocity: makeVec('angularVelocity', index),
      applyForce(force: Triplet, worldPoint: Triplet) {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker.applyForce({ props: [force, worldPoint], uuid });
      },
      applyImpulse(impulse: Triplet, worldPoint: Triplet) {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker.applyImpulse({ props: [impulse, worldPoint], uuid });
      },
      applyLocalForce(force: Triplet, localPoint: Triplet) {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker.applyLocalForce({ props: [force, localPoint], uuid });
      },
      applyLocalImpulse(impulse: Triplet, localPoint: Triplet) {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker.applyLocalImpulse({ props: [impulse, localPoint], uuid });
      },
      applyTorque(torque: Triplet) {
        const { worker } = store.get();
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
        const { scaleOverrides } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        if (uuid) scaleOverrides[uuid] = new Vector3(...scale);
      },
      sleep() {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker.sleep({ uuid });
      },
      sleepSpeedLimit: makeAtomic('sleepSpeedLimit', index),
      sleepTimeLimit: makeAtomic('sleepTimeLimit', index),
      userData: makeAtomic('userData', index),
      velocity: makeVec('velocity', index),
      wakeUp() {
        const { worker } = store.get();
        const uuid = NgtPhysicsUtils.getUUID(ref, index);
        uuid && worker.wakeUp({ uuid });
      },
    };
  }

  const cache: { [index: number]: NgtcWorkerApi } = {};
  const api = {
    ...makeApi(undefined),
    at: (index: number) => cache[index] || (cache[index] = makeApi(index)),
  };
  return { ref, api };
}
