import {
  NGT_OBJECT_3D_WATCHED_CONTROLLER,
  NgtObject3d,
  NgtObject3dController,
  NgtTriplet,
  Object3dProps,
} from '@angular-three/core';
import {
  Directive,
  Inject,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { filter, Observable, Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { WorkerApi } from '../models/api';
import { AtomicName } from '../models/atomic';
import { BodyProps, BodyShapeType } from '../models/body';
import { CannonWorker, SubscriptionTarget } from '../models/messages';
import { PhysicsStoreState } from '../models/physics-state';
import { PropValue } from '../models/prop-value';
import { SubscriptionName } from '../models/subscription-names';
import { ArgFn, GetByIndex, SetOpName } from '../models/types';
import { VectorName } from '../models/vector';
import { PhysicsStore } from '../physics.store';
import {
  capitalize,
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
  subscriptions: PhysicsStoreState['subscriptions'],
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

@Directive()
export abstract class NgtPhysicBody<B extends BodyProps>
  extends ComponentStore<{}>
  implements OnChanges, OnInit
{
  @Input() getPhysicProps?: GetByIndex<B>;

  protected ngtObject3d: NgtObject3d;
  protected ngtObject3dController: NgtObject3dController;
  protected physicsStore: PhysicsStore;

  object3d!: THREE.Object3D;

  protected abstract get type(): BodyShapeType;

  protected abstract get argsFn(): ArgFn<B['args']>;

  private initSub?: Subscription;

  constructor(
    protected ngZone: NgZone,
    @Optional()
    @Inject(NGT_OBJECT_3D_WATCHED_CONTROLLER)
    object3dController?: NgtObject3dController,
    @Optional() object3d?: NgtObject3d,
    @Optional() physicsStore?: PhysicsStore
  ) {
    super({});
    if (!object3d || !object3dController) {
      throw new Error('[ngtBody] directive can only be used on an Object3D');
    }
    this.ngtObject3d = object3d;
    this.ngtObject3dController = object3dController;
    if (!physicsStore) {
      throw new Error(
        '[ngtPhysicBody] directive can only be used inside of <ngt-physics>'
      );
    }
    this.physicsStore = physicsStore;
  }

  private getByIndex(index: number): B & Object3dProps {
    const physicsProps = this.getPhysicProps
      ? this.getPhysicProps(index)
      : ({} as B);

    return {
      ...this.ngtObject3dController.object3dProps,
      ...physicsProps,
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.initSub) {
      this.initSub.unsubscribe();
    }

    this.runInit();
  }

  ngOnInit() {
    if (!this.initSub) {
      this.runInit();
    }
  }

  get api() {
    const { worker, subscriptions } = this.physicsStore.getImperativeState();
    const makeAtomic = <T extends AtomicName>(type: T, index?: number) => {
      const op: SetOpName<T> = `set${capitalize(type)}`;
      return {
        set: (value: PropValue<T>) => {
          const uuid = getUUID(this.object3d, index);
          uuid && worker.postMessage({ op, props: value, uuid });
        },
        subscribe: subscribe(this.object3d, worker, subscriptions, type, index),
      };
    };

    const makeQuaternion = (index?: number) => {
      const op = 'setQuaternion';
      const type = 'quaternion';
      return {
        set: (x: number, y: number, z: number, w: number) => {
          const uuid = getUUID(this.object3d, index);
          uuid && worker.postMessage({ op, props: [x, y, z, w], uuid });
        },
        copy: ({ w, x, y, z }: THREE.Quaternion) => {
          const uuid = getUUID(this.object3d, index);
          uuid && worker.postMessage({ op, props: [x, y, z, w], uuid });
        },
        subscribe: subscribe(this.object3d, worker, subscriptions, type, index),
      };
    };

    const makeRotation = (index?: number) => {
      const op = 'setRotation';
      return {
        set: (x: number, y: number, z: number) => {
          const uuid = getUUID(this.object3d, index);
          uuid && worker.postMessage({ op, props: [x, y, z], uuid });
        },
        copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => {
          const uuid = getUUID(this.object3d, index);
          uuid && worker.postMessage({ op, props: [x, y, z], uuid });
        },
        subscribe: (callback: (value: NgtTriplet) => void) => {
          const id = incrementingId++;
          const target = 'bodies';
          const type = 'quaternion';
          const uuid = getUUID(this.object3d, index);

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
      const op: SetOpName<VectorName> = `set${capitalize(type)}`;
      return {
        set: (x: number, y: number, z: number) => {
          const uuid = getUUID(this.object3d, index);
          uuid && worker.postMessage({ op, props: [x, y, z], uuid });
        },
        copy: ({ x, y, z }: THREE.Vector3 | THREE.Euler) => {
          const uuid = getUUID(this.object3d, index);
          uuid && worker.postMessage({ op, props: [x, y, z], uuid });
        },
        subscribe: subscribe(this.object3d, worker, subscriptions, type, index),
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
          this: NgtPhysicBody<B>,
          force: NgtTriplet,
          worldPoint: NgtTriplet
        ) {
          const uuid = getUUID(this.object3d, index);
          uuid &&
            worker.postMessage({
              op: 'applyForce',
              props: [force, worldPoint],
              uuid,
            });
        },
        applyImpulse(
          this: NgtPhysicBody<B>,
          impulse: NgtTriplet,
          worldPoint: NgtTriplet
        ) {
          const uuid = getUUID(this.object3d, index);
          uuid &&
            worker.postMessage({
              op: 'applyImpulse',
              props: [impulse, worldPoint],
              uuid,
            });
        },
        applyLocalForce(
          this: NgtPhysicBody<B>,
          force: NgtTriplet,
          localPoint: NgtTriplet
        ) {
          const uuid = getUUID(this.object3d, index);
          uuid &&
            worker.postMessage({
              op: 'applyLocalForce',
              props: [force, localPoint],
              uuid,
            });
        },
        applyLocalImpulse(
          this: NgtPhysicBody<B>,
          impulse: NgtTriplet,
          localPoint: NgtTriplet
        ) {
          const uuid = getUUID(this.object3d, index);
          uuid &&
            worker.postMessage({
              op: 'applyLocalImpulse',
              props: [impulse, localPoint],
              uuid,
            });
        },
        applyTorque(this: NgtPhysicBody<B>, torque: NgtTriplet) {
          const uuid = getUUID(this.object3d, index);
          uuid &&
            worker.postMessage({ op: 'applyTorque', props: [torque], uuid });
        },
        // force particular sleep state
        sleep(this: NgtPhysicBody<B>) {
          const uuid = getUUID(this.object3d, index);
          uuid && worker.postMessage({ op: 'sleep', uuid });
        },
        wakeUp(this: NgtPhysicBody<B>) {
          const uuid = getUUID(this.object3d, index);
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

  private readonly initWorkerMessageEffect = this.effect<THREE.Object3D>(
    (object3d$) => {
      let currentWorker: CannonWorker;
      let uuid: string[] = [];
      let refs: PhysicsStoreState['refs'] = {};
      let events: PhysicsStoreState['events'] = {};

      const cleanUp = () => {
        if (currentWorker) {
          this.ngZone.runOutsideAngular(() => {
            uuid.forEach((id) => {
              delete refs[id];
              // if (debugApi) debugApi.remove(id)
              delete events[id];
            });
            currentWorker.postMessage({ op: 'removeBodies', uuid });
          });
        }
      };

      return object3d$.pipe(
        tap({
          next: () => {
            this.ngZone.runOutsideAngular(() => {
              const {
                worker,
                refs: _refs,
                events: _events,
              } = this.physicsStore.context;
              refs = _refs;
              events = _events;

              const object = this.object3d;
              currentWorker = worker;

              let objectCount = 1;

              if (object instanceof THREE.InstancedMesh) {
                object.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
                objectCount = object.count;
              }

              uuid =
                object instanceof THREE.InstancedMesh
                  ? new Array(objectCount)
                      .fill(0)
                      .map((_, i) => `${object.uuid}/${i}`)
                  : [object.uuid];

              const props: (B & { args: unknown })[] =
                object instanceof THREE.InstancedMesh
                  ? uuid.map((id, i) => {
                      const props = this.getByIndex(i);
                      prepare(temp, props);
                      object.setMatrixAt(i, temp.matrix);
                      object.instanceMatrix.needsUpdate = true;
                      refs[id] = object;
                      // if (debugApi) debugApi.add(id, props, type);
                      setupCollision(events, props, id);
                      return { ...props, args: this.argsFn(props.args) };
                    })
                  : uuid.map((id, i) => {
                      const props = this.getByIndex(i);
                      prepare(object, props);
                      refs[id] = object;
                      // if (debugApi) debugApi.add(id, props, type);
                      setupCollision(events, props, id);
                      return { ...props, args: this.argsFn(props.args) };
                    });

              // Register on mount, unregister on unmount
              currentWorker.postMessage({
                op: 'addBodies',
                type: this.type,
                uuid,
                props: props.map(
                  ({
                    onCollide,
                    onCollideBegin,
                    onCollideEnd,
                    ...serializableProps
                  }) => {
                    return {
                      onCollide: Boolean(onCollide),
                      ...serializableProps,
                    };
                  }
                ),
              });
            });
          },
          complete: cleanUp,
          unsubscribe: cleanUp,
        })
      );
    }
  );

  private runInit() {
    this.initSub = this.initWorkerMessageEffect(
      (this.ngtObject3d.object3d$ as Observable<THREE.Object3D>).pipe(
        filter(Boolean),
        tap((object3d) => {
          this.ngZone.runOutsideAngular(() => {
            this.object3d = object3d;
          });
        })
      )
    ) as unknown as Subscription;
  }
}
