import {
  capitalize,
  EnhancedRxState,
  NGT_OBJECT_INPUTS_WATCHED_CONTROLLER,
  NGT_OBJECT_WATCHED_CONTROLLER,
  NgtObject3dController,
  NgtObject3dInputsController,
  NgtObject3dProps,
  NgtTriplet,
} from '@angular-three/core';
import { Inject, Injectable, Optional } from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk';
import { stateful } from '@rx-angular/state';
import { combineLatest, map, startWith } from 'rxjs';
import * as THREE from 'three';
import { NgtCannonDebugStore } from '../debug/debug.store';
import { WorkerApi } from '../models/api';
import { AtomicName } from '../models/atomic';
import { BodyProps, BodyShapeType } from '../models/body';
import { CannonWorker, SubscriptionTarget } from '../models/messages';
import { NgtPhysicsStoreState } from '../models/physics-state';
import { PropValue } from '../models/prop-value';
import { SubscriptionName } from '../models/subscription-names';
import { ArgFn, GetByIndex, SetOpName } from '../models/types';
import { VectorName } from '../models/vector';
import { NgtPhysicsStore } from '../physics.store';
import { NGT_PHYSIC_BODY_ARGS_FN, NGT_PHYSIC_BODY_TYPE } from './tokens';
import {
  getUUID,
  prepare,
  quaternionToRotation,
  setupCollision,
} from './utils';

const temp = new THREE.Object3D();

let incrementingId = 0;

function subscribe<T extends SubscriptionName>(
  ref: THREE.Object3D,
  worker: CannonWorker,
  subscriptions: NgtPhysicsStoreState['subscriptions'],
  type: T,
  index?: number,
  target: SubscriptionTarget = 'bodies'
) {
  return (callback: (value: PropValue<T>) => void) => {
    const id = incrementingId++;
    subscriptions[id] = { [type]: callback };
    const uuid = getUUID(ref, index);
    uuid &&
      worker.postMessage({
        op: 'subscribe',
        uuid,
        props: { id, type, target },
      });
    return () => {
      delete subscriptions[id];
      worker.postMessage({ op: 'unsubscribe', props: id });
    };
  };
}

export interface NgtPhysicBodyStoreState {
  getPhysicProps?: GetByIndex<BodyProps>;
  object3d?: THREE.Object3D;
}

@Injectable()
export class NgtPhysicBodyStore extends EnhancedRxState<NgtPhysicBodyStoreState> {
  #changes$ = combineLatest([
    this.select('getPhysicProps').pipe(startWith(undefined)),
    this.objectInputsController.change$.pipe(stateful(startWith({}))),
  ]).pipe(
    map(([getPhysicProps, inputChanges]) => ({
      getPhysicProps,
      inputChanges,
    }))
  );

  constructor(
    @Optional()
    @Inject(NGT_OBJECT_INPUTS_WATCHED_CONTROLLER)
    private objectInputsController: NgtObject3dInputsController,
    @Optional()
    @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
    private objectController: NgtObject3dController,
    @Inject(NGT_PHYSIC_BODY_ARGS_FN) private argsFn: ArgFn<unknown>,
    @Optional() @Inject(NGT_PHYSIC_BODY_TYPE) private type: BodyShapeType,
    private physicsStore: NgtPhysicsStore,
    @Optional() private cannonDebugStore: NgtCannonDebugStore
  ) {
    super();

    if (!type) {
      throw new Error('NGT_PHYSIC_BODY_TYPE is required');
    }

    if (!objectController) {
      throw new Error(
        '[ngtPhysic***] directive can only be used on an Object3D'
      );
    }

    if (!physicsStore) {
      throw new Error(
        '[ngtPhysic***] directive can only be used inside of <ngt-physics>'
      );
    }

    this.set({
      getPhysicProps: undefined,
      object3d: objectController.object3d,
    });
  }

  init() {
    this.set({ object3d: this.objectController.object3d });
    this.holdEffect(this.#changes$, this.#initWorker.bind(this));
  }

  get api(): WorkerApi & { at: (index: number) => WorkerApi } {
    this.set({ object3d: this.objectController.object3d });
    const { worker, subscriptions } = this.physicsStore.get();
    const object3d = this.get('object3d')!;
    const makeAtomic = <T extends AtomicName>(type: T, index?: number) => {
      const op: SetOpName<T> = `set${capitalize(type)}`;
      return {
        set: (value: PropValue<T>) => {
          requestAnimationFrame(() => {
            const uuid = getUUID(object3d, index);
            uuid && worker.postMessage({ op, props: value, uuid });
          });
        },
        subscribe: subscribe(object3d, worker, subscriptions, type, index),
      };
    };

    const makeQuaternion = (index?: number) => {
      const op = 'setQuaternion';
      const type = 'quaternion';
      return {
        set: (x: number, y: number, z: number, w: number) => {
          requestAnimationFrame(() => {
            const uuid = getUUID(object3d, index);
            uuid && worker.postMessage({ op, props: [x, y, z, w], uuid });
          });
        },
        copy: ({ w, x, y, z }: THREE.Quaternion) => {
          requestAnimationFrame(() => {
            const uuid = getUUID(object3d, index);
            uuid && worker.postMessage({ op, props: [x, y, z, w], uuid });
          });
        },
        subscribe: subscribe(object3d, worker, subscriptions, type, index),
      };
    };

    const makeRotation = (index?: number) => {
      const op = 'setRotation';
      return {
        set: (x: number, y: number, z: number) => {
          requestAnimationFrame(() => {
            const uuid = getUUID(object3d, index);
            uuid && worker.postMessage({ op, props: [x, y, z], uuid });
          });
        },
        copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => {
          requestAnimationFrame(() => {
            const uuid = getUUID(object3d, index);
            uuid && worker.postMessage({ op, props: [x, y, z], uuid });
          });
        },
        subscribe: (callback: (value: NgtTriplet) => void) => {
          const id = incrementingId++;
          const target = 'bodies';
          const type = 'quaternion';
          const uuid = getUUID(object3d, index);

          subscriptions[id] = { [type]: quaternionToRotation(callback) };
          uuid &&
            worker.postMessage({
              op: 'subscribe',
              uuid,
              props: { id, type, target },
            });
          return () => {
            delete subscriptions[id];
            worker.postMessage({ op: 'unsubscribe', props: id });
          };
        },
      };
    };

    const makeVec = (type: VectorName, index?: number) => {
      const op: SetOpName<VectorName> = `set${capitalize(
        type
      )}` as SetOpName<VectorName>;
      return {
        set: (x: number, y: number, z: number) => {
          requestAnimationFrame(() => {
            const uuid = getUUID(object3d, index);
            uuid && worker.postMessage({ op, props: [x, y, z], uuid });
          });
        },
        copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => {
          requestAnimationFrame(() => {
            const uuid = getUUID(object3d, index);
            uuid && worker.postMessage({ op, props: [x, y, z], uuid });
          });
        },
        subscribe: subscribe(object3d, worker, subscriptions, type, index),
      };
    };

    function makeApi(index?: number): WorkerApi {
      return {
        angularFactor: makeVec('angularFactor', index),
        angularVelocity: makeVec('angularVelocity', index),
        linearFactor: makeVec('linearFactor', index),
        position: makeVec('position', index),
        quaternion: makeQuaternion(index),
        rotation: makeRotation(index),
        velocity: makeVec('velocity', index),
        allowSleep: makeAtomic('allowSleep', index),
        angularDamping: makeAtomic('angularDamping', index),
        collisionFilterGroup: makeAtomic('collisionFilterGroup', index),
        collisionFilterMask: makeAtomic('collisionFilterMask', index),
        collisionResponse: makeAtomic('collisionResponse', index),
        isTrigger: makeAtomic('isTrigger', index),
        fixedRotation: makeAtomic('fixedRotation', index),
        linearDamping: makeAtomic('linearDamping', index),
        mass: makeAtomic('mass', index),
        material: makeAtomic('material', index),
        sleepSpeedLimit: makeAtomic('sleepSpeedLimit', index),
        sleepTimeLimit: makeAtomic('sleepTimeLimit', index),
        userData: makeAtomic('userData', index),
        // Apply functions
        applyForce(
          this: NgtPhysicBodyStore,
          force: NgtTriplet,
          worldPoint: NgtTriplet
        ) {
          const uuid = getUUID(object3d, index);
          uuid &&
            worker.postMessage({
              op: 'applyForce',
              props: [force, worldPoint],
              uuid,
            });
        },
        applyImpulse(
          this: NgtPhysicBodyStore,
          impulse: NgtTriplet,
          worldPoint: NgtTriplet
        ) {
          const uuid = getUUID(object3d, index);
          uuid &&
            worker.postMessage({
              op: 'applyImpulse',
              props: [impulse, worldPoint],
              uuid,
            });
        },
        applyLocalForce(
          this: NgtPhysicBodyStore,
          force: NgtTriplet,
          localPoint: NgtTriplet
        ) {
          const uuid = getUUID(object3d, index);
          uuid &&
            worker.postMessage({
              op: 'applyLocalForce',
              props: [force, localPoint],
              uuid,
            });
        },
        applyLocalImpulse(
          this: NgtPhysicBodyStore,
          impulse: NgtTriplet,
          localPoint: NgtTriplet
        ) {
          const uuid = getUUID(object3d, index);
          uuid &&
            worker.postMessage({
              op: 'applyLocalImpulse',
              props: [impulse, localPoint],
              uuid,
            });
        },
        applyTorque(this: NgtPhysicBodyStore, torque: NgtTriplet) {
          const uuid = getUUID(object3d, index);
          uuid &&
            worker.postMessage({ op: 'applyTorque', props: [torque], uuid });
        },
        // force particular sleep state
        sleep(this: NgtPhysicBodyStore) {
          const uuid = getUUID(object3d, index);
          uuid && worker.postMessage({ op: 'sleep', uuid });
        },
        wakeUp(this: NgtPhysicBodyStore) {
          const uuid = getUUID(object3d, index);
          uuid && worker.postMessage({ op: 'wakeUp', uuid });
        },
      };
    }

    const cache: { [index: number]: WorkerApi } = {};
    return {
      ...makeApi(undefined),
      at: (index: number) => cache[index] || (cache[index] = makeApi(index)),
    };
  }

  #getByIndex(index: number): BodyProps & NgtObject3dProps {
    const getPhysicProps = this.get('getPhysicProps');
    const physicsProps = getPhysicProps
      ? getPhysicProps(index)
      : ({} as BodyProps);

    return {
      ...this.objectInputsController.object3dProps,
      ...physicsProps,
    } as BodyProps & NgtObject3dProps;
  }

  #initWorker() {
    this.set({ object3d: this.objectController.object3d });
    let uuid: string[] = [];
    const { worker: currentWorker, refs, events } = this.physicsStore.get();

    const object = this.get('object3d') || new THREE.Object3D();

    let objectCount = 1;

    if (object instanceof THREE.InstancedMesh) {
      object.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      objectCount = object.count;
    }

    uuid =
      object instanceof THREE.InstancedMesh
        ? new Array(objectCount).fill(0).map((_, i) => `${object.uuid}/${i}`)
        : [object.uuid];

    const props: (BodyProps & { args: unknown })[] = uuid.map((id, i) => {
      const physicProps = this.#getByIndex(i);
      prepare(temp, physicProps);
      if (object instanceof THREE.InstancedMesh) {
        object.setMatrixAt(i, temp.matrix);
        object.instanceMatrix.needsUpdate = true;
      }
      refs[id] = object;
      if (this.cannonDebugStore) {
        this.cannonDebugStore.api.add(id, physicProps, this.type);
      }
      setupCollision(events, physicProps, id);
      return { ...physicProps, args: this.argsFn(physicProps.args) };
    });

    // Register on mount, unregister on unmount
    currentWorker.postMessage({
      op: 'addBodies',
      type: this.type,
      uuid,
      props: props.map(
        ({ onCollide, onCollideBegin, onCollideEnd, ...serializableProps }) => {
          return {
            onCollide: Boolean(onCollide),
            ...serializableProps,
          };
        }
      ),
    });

    return () => {
      if (currentWorker) {
        uuid.forEach((id) => {
          delete refs[id];
          if (this.cannonDebugStore) {
            this.cannonDebugStore.api.remove(id);
          }
          delete events[id];
        });
        currentWorker.postMessage({ op: 'removeBodies', uuid });
      }
    };
  }
}
