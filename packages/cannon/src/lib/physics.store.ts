import {
  AnimationStore,
  EnhancedComponentStore,
  LoopService,
  NgtTriplet,
} from '@angular-three/core';
import { Injectable, NgZone, SkipSelf } from '@angular/core';
import { map, noop, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import { Broadphase } from './models/broadphase';
import { Buffers } from './models/buffers';
import { DefaultContactMaterial } from './models/default-contact-material';
import { IncomingWorkerMessage, WorkerFrameMessage } from './models/messages';
import { PhysicsStoreState } from './models/physics-state';
import { Solver } from './models/solver';

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
export class PhysicsStore extends EnhancedComponentStore<PhysicsStoreState> {
  private loopStop?: () => void;

  readonly initProps$ = this.select(
    this.selectors.gravity$,
    this.selectors.tolerance$,
    this.selectors.step$,
    this.selectors.iterations$,
    this.selectors.broadphase$,
    this.selectors.allowSleep$,
    this.selectors.axisIndex$,
    this.selectors.defaultContactMaterial$,
    this.selectors.quatNormalizeFast$,
    this.selectors.quatNormalizeSkip$,
    this.selectors.solver$,
    (
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
      solver
    ) => ({
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
    })
  );

  readonly context$ = this.select(
    this.selectors.worker$,
    this.selectors.refs$,
    this.selectors.buffers$,
    this.selectors.events$,
    this.selectors.subscriptions$,
    this.selectors.bodies$,
    (worker, refs, buffers, events, subscriptions, bodies) => ({
      worker,
      refs,
      buffers,
      events,
      subscriptions,
      bodies,
    }),
    { debounce: true }
  );

  constructor(
    private ngZone: NgZone,
    @SkipSelf() private animationStore: AnimationStore,
    @SkipSelf() private loopService: LoopService
  ) {
    super({
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

    this.setBuffers(
      this.selectors.size$.pipe(
        map((size) => ({
          positions: new Float32Array((size as number) * 3),
          quaternions: new Float32Array((size as number) * 4),
        }))
      )
    );
    this.initLoopEffect();
  }

  readonly setSize = this.updater<number>((state, size) => ({
    ...state,
    size,
  }));

  readonly setShouldInvalidate = this.updater<boolean>(
    (state, shouldInvalidate) => ({ ...state, shouldInvalidate })
  );

  readonly setTolerance = this.updater<number>((state, tolerance) => ({
    ...state,
    tolerance,
  }));

  readonly setStep = this.updater<number>((state, step) => ({
    ...state,
    step,
  }));

  readonly setIterations = this.updater<number>((state, iterations) => ({
    ...state,
    iterations,
  }));

  readonly setAllowSleep = this.updater<boolean>((state, allowSleep) => ({
    ...state,
    allowSleep,
  }));

  readonly setBroadphase = this.updater<Broadphase>((state, broadphase) => ({
    ...state,
    broadphase,
  }));

  readonly setGravity = this.updater<NgtTriplet>((state, gravity) => ({
    ...state,
    gravity,
  }));

  readonly setQuatNormalizeFast = this.updater<boolean>(
    (state, quatNormalizeFast) => ({
      ...state,
      quatNormalizeFast,
    })
  );

  readonly setQuatNormalizeSkip = this.updater<number>(
    (state, quatNormalizeSkip) => ({ ...state, quatNormalizeSkip })
  );

  readonly setSolver = this.updater<Solver>((state, solver) => ({
    ...state,
    solver,
  }));

  readonly setAxisIndex = this.updater<number>((state, axisIndex) => ({
    ...state,
    axisIndex,
  }));

  readonly setDefaultContactMaterial = this.updater<DefaultContactMaterial>(
    (state, defaultContactMaterial) => ({
      ...state,
      defaultContactMaterial,
    })
  );

  readonly setBuffers = this.updater<Buffers>((state, buffers) => ({
    ...state,
    buffers,
  }));

  readonly initLoopEffect = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.ngZone.runOutsideAngular(() => {
          this.loopStop = this.animationStore.registerAnimation(() => {
            const { worker, buffers } = this.getImperativeState();
            if (
              buffers.positions.byteLength !== 0 &&
              buffers.quaternions.byteLength !== 0
            ) {
              worker.postMessage({ op: 'step', ...buffers }, [
                buffers.positions.buffer,
                buffers.quaternions.buffer,
              ]);
            }
          });
        });
      })
    )
  );

  readonly initEffect = this.effect(($) => {
    let _worker: Worker;
    return $.pipe(
      withLatestFrom(this.selectors.worker$, this.initProps$),
      tap({
        next: ([, worker, initProps]) => {
          this.ngZone.runOutsideAngular(() => {
            _worker = worker;
            worker.postMessage({
              op: 'init',
              props: initProps,
            });

            let i = 0;
            let body: string;
            let callback;

            worker.onmessage = (e: IncomingWorkerMessage) => {
              const {
                shouldInvalidate,
                buffers,
                bodies,
                subscriptions,
                events,
                refs,
              } = this.getImperativeState();
              switch (e.data.op) {
                case 'frame':
                  buffers.positions = e.data.positions;
                  buffers.quaternions = e.data.quaternions;
                  if (e.data.bodies) {
                    for (i = 0; i < e.data.bodies.length; i++) {
                      body = e.data.bodies[i];
                      bodies[body] = e.data.bodies.indexOf(body);
                      this.patchState((state) => ({
                        bodies: {
                          ...state.bodies,
                          [body]: (
                            (e.data as WorkerFrameMessage['data'])
                              .bodies as string[]
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
                      this.loopService.start();
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
          });
        },
      })
    );
  });

  readonly updateWorldPropsEffect = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.updateAxisIndexEffect(this.selectors.axisIndex$);
        this.updateBroadphaseEffect(this.selectors.broadphase$);
        this.updateGravityEffect(this.selectors.gravity$);
        this.updateIterationsEffect(this.selectors.iterations$);
        this.updateStepEffect(this.selectors.step$);
        this.updateToleranceEffect(this.selectors.tolerance$);
      })
    )
  );

  readonly updateAxisIndexEffect = this.effect<PhysicsStoreState['axisIndex']>(
    (axisIndex$) =>
      axisIndex$.pipe(
        withLatestFrom(this.selectors.worker$),
        tap(([axisIndex, worker]) => {
          void worker.postMessage({ op: 'setAxisIndex', props: axisIndex });
        })
      )
  );

  readonly updateBroadphaseEffect = this.effect<
    PhysicsStoreState['broadphase']
  >((broadphase$) =>
    broadphase$.pipe(
      withLatestFrom(this.selectors.worker$),
      tap(([broadphase, worker]) => {
        void worker.postMessage({ op: 'setBroadphase', props: broadphase });
      })
    )
  );

  readonly updateGravityEffect = this.effect<PhysicsStoreState['gravity']>(
    (gravity$) =>
      gravity$.pipe(
        withLatestFrom(this.selectors.worker$),
        tap(([gravity, worker]) => {
          void worker.postMessage({ op: 'setGravity', props: gravity });
        })
      )
  );

  readonly updateIterationsEffect = this.effect<
    PhysicsStoreState['iterations']
  >((iterations$) =>
    iterations$.pipe(
      withLatestFrom(this.selectors.worker$),
      tap(([iterations, worker]) => {
        void worker.postMessage({ op: 'setIterations', props: iterations });
      })
    )
  );

  readonly updateStepEffect = this.effect<PhysicsStoreState['step']>((step$) =>
    step$.pipe(
      withLatestFrom(this.selectors.worker$),
      tap(([step, worker]) => {
        void worker.postMessage({ op: 'setStep', props: step });
      })
    )
  );

  readonly updateToleranceEffect = this.effect<PhysicsStoreState['tolerance']>(
    (tolerance$) =>
      tolerance$.pipe(
        withLatestFrom(this.selectors.worker$),
        tap(([tolerance, worker]) => {
          void worker.postMessage({ op: 'setTolerance', props: tolerance });
        })
      )
  );

  ngOnDestroy() {
    if (this.loopStop) {
      this.loopStop();
    }
    super.ngOnDestroy();
  }

  get context() {
    const { worker, buffers, events, subscriptions, bodies, refs } =
      this.getImperativeState();
    return { worker, buffers, events, subscriptions, bodies, refs };
  }
}
