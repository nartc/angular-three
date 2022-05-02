import { checkNeedsUpdate, NgtComponentStore, NgtStore, tapEffect } from '@angular-three/core';
import { Injectable, NgZone } from '@angular/core';
import {
  Buffers,
  CannonWorkerAPI,
  CannonWorkerProps,
  CollideBeginEvent,
  CollideEndEvent,
  CollideEvent,
  RayhitEvent,
  Refs,
  Subscriptions,
  WorkerCollideBeginEvent,
  WorkerCollideEndEvent,
  WorkerCollideEvent,
  WorkerFrameMessage,
  WorkerRayhitEvent,
} from '@pmndrs/cannon-worker-api';
import type { EventEmitter } from 'events';
import { tap } from 'rxjs';
import * as THREE from 'three';

type CannonEvent = CollideBeginEvent | CollideEndEvent | CollideEvent | RayhitEvent;
type CallbackByType<T extends { type: string }> = {
  [K in T['type']]?: T extends { type: K } ? (e: T) => void : never;
};

export type CannonEvents = {
  [uuid: string]: Partial<CallbackByType<CannonEvent>>;
};

export type ScaleOverrides = { [uuid: string]: THREE.Vector3 };

export interface NgtPhysicsState extends CannonWorkerProps {
  worker: CannonWorkerAPI;
  refs: Refs;
  scaleOverrides: ScaleOverrides;
  buffers: Buffers;
  events: CannonEvents;
  subscriptions: Subscriptions;
  bodies: Record<string, number>;

  isPaused?: boolean;
  maxSubSteps?: number;
  shouldInvalidate?: boolean;
  stepSize?: number;
}

type WorkerInputs = Pick<
  NgtPhysicsState,
  | 'allowSleep'
  | 'axisIndex'
  | 'broadphase'
  | 'defaultContactMaterial'
  | 'gravity'
  | 'iterations'
  | 'quatNormalizeFast'
  | 'quatNormalizeSkip'
  | 'size'
  | 'solver'
  | 'tolerance'
>;

type BeforeRenderParams = Pick<NgtPhysicsState, 'isPaused' | 'maxSubSteps' | 'stepSize'>;

const v = new THREE.Vector3();
const s = new THREE.Vector3(1, 1, 1);
const q = new THREE.Quaternion();
const m = new THREE.Matrix4();

@Injectable()
export class NgtPhysicsStore extends NgtComponentStore<NgtPhysicsState> {
  private timeSinceLastCalled = 0;

  private readonly workerInputs = this.select(
    this.select((s) => s.allowSleep),
    this.select((s) => s.axisIndex),
    this.select((s) => s.broadphase),
    this.select((s) => s.defaultContactMaterial),
    this.select((s) => s.gravity),
    this.select((s) => s.iterations),
    this.select((s) => s.quatNormalizeFast),
    this.select((s) => s.quatNormalizeSkip),
    this.select((s) => s.size),
    this.select((s) => s.solver),
    this.select((s) => s.tolerance),
    (
      allowSleep,
      axisIndex,
      broadphase,
      defaultContactMaterial,
      gravity,
      iterations,
      quatNormalizeFast,
      quatNormalizeSkip,
      size,
      solver,
      tolerance
    ) => ({
      allowSleep,
      axisIndex,
      broadphase,
      defaultContactMaterial,
      gravity,
      iterations,
      quatNormalizeFast,
      quatNormalizeSkip,
      size,
      solver,
      tolerance,
    })
  );

  private readonly beforeRenderParams$ = this.select(
    this.select((s) => s.isPaused),
    this.select((s) => s.maxSubSteps),
    this.select((s) => s.stepSize),
    (isPaused, maxSubSteps, stepSize) => ({
      isPaused,
      maxSubSteps,
      stepSize,
    })
  );

  constructor(private zone: NgZone, private store: NgtStore) {
    super();
    this.set({
      bodies: {},
      events: {},
      refs: {},
      scaleOverrides: {},
      subscriptions: {},

      allowSleep: false,
      axisIndex: 0,
      broadphase: 'Naive',
      defaultContactMaterial: { contactEquationStiffness: 1e6 },
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

  init() {
    this.zone.runOutsideAngular(() => {
      this.initWorker(this.workerInputs);

      this.setAxisIndex(this.select((s) => s.axisIndex));
      this.setBroadphase(this.select((s) => s.broadphase));
      this.setGravity(this.select((s) => s.gravity));
      this.setIterations(this.select((s) => s.iterations));
      this.setTolerance(this.select((s) => s.tolerance));

      // register physics beforeRender on next frame
      requestAnimationFrame(() => {
        this.initBeforeRender(this.beforeRenderParams$);
      });
    });
  }

  private readonly initBeforeRender = this.effect<BeforeRenderParams>(
    tapEffect(({ isPaused, maxSubSteps, stepSize }) => {
      const unregister = this.store.registerBeforeRender({
        callback: ({ delta }) => {
          if (isPaused) return;
          const worker = this.get((s) => s.worker);
          if (worker) {
            this.timeSinceLastCalled += delta;
            worker.step({
              maxSubSteps,
              stepSize: stepSize as number,
              timeSinceLastCalled: this.timeSinceLastCalled,
            });
            this.timeSinceLastCalled = 0;
          }
        },
      });

      return () => {
        unregister();
      };
    })
  );

  private readonly setAxisIndex = this.effect<NgtPhysicsState['axisIndex']>(
    tap((axisIndex) => {
      const worker = this.get((s) => s.worker);
      if (worker) {
        worker.axisIndex = axisIndex!;
      }
    })
  );
  private readonly setBroadphase = this.effect<NgtPhysicsState['broadphase']>(
    tap((broadphase) => {
      const worker = this.get((s) => s.worker);
      if (worker) {
        worker.broadphase = broadphase!;
      }
    })
  );
  private readonly setGravity = this.effect<NgtPhysicsState['gravity']>(
    tap((gravity) => {
      const worker = this.get((s) => s.worker);
      if (worker) {
        worker.gravity = gravity!;
      }
    })
  );
  private readonly setIterations = this.effect<NgtPhysicsState['iterations']>(
    tap((iterations) => {
      const worker = this.get((s) => s.worker);
      if (worker) {
        worker.iterations = iterations!;
      }
    })
  );
  private readonly setTolerance = this.effect<NgtPhysicsState['tolerance']>(
    tap((tolerance) => {
      const worker = this.get((s) => s.worker);
      if (worker) {
        worker.tolerance = tolerance!;
      }
    })
  );

  private readonly initWorker = this.effect<WorkerInputs>(
    tapEffect((physicsInputs) => {
      const worker = new CannonWorkerAPI(physicsInputs);
      this.set({ worker });

      worker.connect();
      worker.init();

      (worker as unknown as EventEmitter).on('collide', this.collideHandler.bind(this));
      (worker as unknown as EventEmitter).on('collideBegin', this.collideBeginHandler.bind(this));
      (worker as unknown as EventEmitter).on('collideEnd', this.collideEndHandler.bind(this));
      (worker as unknown as EventEmitter).on('frame', this.frameHandler.bind(this));
      (worker as unknown as EventEmitter).on('rayhit', this.rayhitHandler.bind(this));

      return () => {
        worker.terminate();
        (worker as unknown as { removeAllListeners: () => void }).removeAllListeners();
      };
    })
  );

  private readonly collideHandler = this.effect<WorkerCollideEvent['data']>(
    tap(({ body, contact: { bi, bj, ...contactRest }, target, ...rest }: WorkerCollideEvent['data']) => {
      const { events, refs } = this.get();
      const cb = events[target]?.collide;
      cb &&
        cb({
          body: refs[body],
          contact: {
            bi: refs[bi],
            bj: refs[bj],
            ...contactRest,
          },
          target: refs[target],
          ...rest,
        });
    })
  );

  private readonly collideBeginHandler = this.effect<WorkerCollideBeginEvent['data']>(
    tap(({ bodyA, bodyB }: WorkerCollideBeginEvent['data']) => {
      const { events, refs } = this.get();
      const cbA = events[bodyA]?.collideBegin;
      cbA &&
        cbA({
          body: refs[bodyB],
          op: 'event',
          target: refs[bodyA],
          type: 'collideBegin',
        });
      const cbB = events[bodyB]?.collideBegin;
      cbB &&
        cbB({
          body: refs[bodyA],
          op: 'event',
          target: refs[bodyB],
          type: 'collideBegin',
        });
    })
  );

  private readonly collideEndHandler = this.effect<WorkerCollideEndEvent['data']>(
    tap(({ bodyA, bodyB }: WorkerCollideEndEvent['data']) => {
      const { events, refs } = this.get();
      const cbA = events[bodyA]?.collideEnd;
      cbA &&
        cbA({
          body: refs[bodyB],
          op: 'event',
          target: refs[bodyA],
          type: 'collideEnd',
        });
      const cbB = events[bodyB]?.collideEnd;
      cbB &&
        cbB({
          body: refs[bodyA],
          op: 'event',
          target: refs[bodyB],
          type: 'collideEnd',
        });
    })
  );

  private readonly frameHandler = this.effect<WorkerFrameMessage['data']>(
    tap(({ active, bodies: uuids = [], observations, positions, quaternions }: WorkerFrameMessage['data']) => {
      const { bodies, subscriptions, refs, scaleOverrides, shouldInvalidate } = this.get();
      const invalidate = this.store.get((s) => s.invalidate);
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
          if (ref instanceof THREE.InstancedMesh) {
            for (let i = 0; i < ref.count; i++) {
              const uuid = `${ref.uuid}/${i}`;
              const index = bodies[uuid];
              if (index !== undefined) {
                ref.setMatrixAt(i, apply(index, positions, quaternions, scaleOverrides[uuid]));
                checkNeedsUpdate(ref.instanceMatrix);
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
    })
  );

  readonly rayhitHandler = this.effect<WorkerRayhitEvent['data']>(
    tap(({ body, ray: { uuid, ...rayRest }, ...rest }: WorkerRayhitEvent['data']) => {
      const { events, refs } = this.get();
      const cb = events[uuid]?.rayhit;
      cb &&
        cb({
          body: body ? refs[body] : null,
          ray: { uuid, ...rayRest },
          ...rest,
        });
    })
  );
}

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
