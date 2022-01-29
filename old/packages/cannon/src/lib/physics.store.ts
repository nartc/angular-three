import {
  EnhancedRxState,
  NgtAnimationFrameStore,
  NgtLoopService,
  NgtStore,
} from '@angular-three/core';
import { Injectable } from '@angular/core';
import { noop } from 'rxjs';
import * as THREE from 'three';
import { Buffers } from './models/buffers';
import { IncomingWorkerMessage, WorkerFrameMessage } from './models/messages';
import { NgtPhysicsStoreState } from './models/physics-state';

const v = new THREE.Vector3();
const s = new THREE.Vector3(1, 1, 1);
const q = new THREE.Quaternion();
const m = new THREE.Matrix4();

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

@Injectable()
export class NgtPhysicsStore extends EnhancedRxState<
  NgtPhysicsStoreState,
  { init: void }
> {
  actions = this.create();

  constructor(
    private animationFrameStore: NgtAnimationFrameStore,
    private store: NgtStore,
    private loopService: NgtLoopService
  ) {
    super();
    this.set({
      worker: new Worker(
        new URL('./utils/worker.js', import.meta.url)
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

    this.connect('buffers', this.select('size'), (_, size) => ({
      positions: new Float32Array((size as number) * 3),
      quaternions: new Float32Array((size as number) * 4),
    }));

    this.holdEffect(this.actions.init$, this.#initLoop.bind(this));
    this.holdEffect(this.actions.init$, this.#initWorker.bind(this));

    this.hold(this.select('axisIndex'), (axisIndex) => {
      const worker = this.get('worker');
      worker.postMessage({ op: 'setAxisIndex', props: axisIndex });
    });

    this.hold(this.select('broadphase'), (broadphase) => {
      const worker = this.get('worker');
      worker.postMessage({ op: 'setBroadphase', props: broadphase });
    });

    this.hold(this.select('gravity'), (gravity) => {
      const worker = this.get('worker');
      worker.postMessage({ op: 'setGravity', props: gravity });
    });

    this.hold(this.select('iterations'), (iterations) => {
      const worker = this.get('worker');
      worker.postMessage({ op: 'setIterations', props: iterations });
    });

    this.hold(this.select('step'), (step) => {
      const worker = this.get('worker');
      worker.postMessage({ op: 'setStep', props: step });
    });

    this.hold(this.select('tolerance'), (tolerance) => {
      const worker = this.get('worker');
      worker.postMessage({ op: 'setTolerance', props: tolerance });
    });
  }

  #initLoop() {
    const animationUuid = this.animationFrameStore.register({
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

    return () => {
      this.animationFrameStore.actions.unsubscriberUuid(animationUuid);
    };
  }

  #initWorker() {
    const worker = this.get('worker');

    worker.postMessage({ op: 'init', props: this.#initProps });

    let i = 0;
    let body: string;
    let callback;
    worker.onmessage = (e: IncomingWorkerMessage) => {
      const { shouldInvalidate, buffers, bodies, subscriptions, events, refs } =
        this.get();

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
                    (e.data as WorkerFrameMessage['data']).bodies as string[]
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
                    ref.setMatrixAt(i, apply(index, buffers));
                  }
                  ref.instanceMatrix.needsUpdate = true;
                }
              } else {
                apply(bodies[ref.uuid], buffers, ref);
              }
            }

            if (shouldInvalidate) {
              this.loopService.invalidate();
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
              callback = events[e.data.bodyA]?.collideBegin || noop;
              callback({
                op: 'event',
                type: 'collideBegin',
                target: refs[e.data.bodyA],
                body: refs[e.data.bodyB],
              });
              callback = events[e.data.bodyB]?.collideBegin || noop;
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

    return () => {
      worker.terminate();
    };
  }

  get #initProps() {
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
}
