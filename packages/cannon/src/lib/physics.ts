import {
  filterFalsy,
  injectNgtStore,
  NgtAnyFunction,
  NgtAnyRecord,
  NgtComponentStore,
  tapEffect,
} from '@angular-three/core';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  CannonWorkerAPI,
  CannonWorkerProps,
  WorkerCollideBeginEvent,
  WorkerCollideEndEvent,
  WorkerCollideEvent,
  WorkerFrameMessage,
  WorkerRayhitEvent,
} from '@pmndrs/cannon-worker-api';
import { map, Subscription, tap } from 'rxjs';

import { InstancedMesh, Matrix4, Quaternion, Vector3 } from 'three';
import { injectNgtcPhysicsStore, NgtcPhysicsStore } from './store';

const v = new Vector3();
const s = new Vector3(1, 1, 1);
const q = new Quaternion();
const m = new Matrix4();

function apply(
  index: number,
  positions: Float32Array,
  quaternions: Float32Array,
  scale = s,
  object?: THREE.Object3D
) {
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

export interface NgtcPhysicsInputs extends CannonWorkerProps {
  isPaused?: boolean;
  maxSubSteps?: number;
  shouldInvalidate?: boolean;
  stepSize?: number;
}

@Component({
  selector: 'ngtc-physics',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [NgtcPhysicsStore],
})
export class NgtsPhysics extends NgtComponentStore<NgtcPhysicsInputs> implements OnInit, OnDestroy {
  private readonly store = injectNgtStore();
  private readonly physicsStore = injectNgtcPhysicsStore();

  override initialize() {
    super.initialize();
    this.set({
      allowSleep: false,
      axisIndex: 0,
      broadphase: 'Naive',
      defaultContactMaterial: { contactEquationStiffness: 1e6 },
      frictionGravity: null,
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

  @Input() set allowSleep(allowSleep: NgtcPhysicsInputs['allowSleep']) {
    this.set({ allowSleep });
  }

  @Input() set axisIndex(axisIndex: NgtcPhysicsInputs['axisIndex']) {
    this.set({ axisIndex });
  }

  @Input() set broadphase(broadphase: NgtcPhysicsInputs['broadphase']) {
    this.set({ broadphase });
  }

  @Input() set defaultContactMaterial(
    defaultContactMaterial: NgtcPhysicsInputs['defaultContactMaterial']
  ) {
    this.set({ defaultContactMaterial });
  }

  @Input() set frictionGravity(frictionGravity: NgtcPhysicsInputs['frictionGravity']) {
    this.set({ frictionGravity });
  }

  @Input() set gravity(gravity: NgtcPhysicsInputs['gravity']) {
    this.set({ gravity });
  }

  @Input() set iterations(iterations: NgtcPhysicsInputs['iterations']) {
    this.set({ iterations });
  }

  @Input() set quatNormalizeFast(quatNormalizeFast: NgtcPhysicsInputs['quatNormalizeFast']) {
    this.set({ quatNormalizeFast });
  }

  @Input() set quatNormalizeSkip(quatNormalizeSkip: NgtcPhysicsInputs['quatNormalizeSkip']) {
    this.set({ quatNormalizeSkip });
  }

  @Input() set solver(solver: NgtcPhysicsInputs['solver']) {
    this.set({ solver });
  }

  @Input() set tolerance(tolerance: NgtcPhysicsInputs['tolerance']) {
    this.set({ tolerance });
  }

  @Input() set size(size: NgtcPhysicsInputs['size']) {
    this.set({ size });
  }

  @Input() set isPaused(isPaused: NgtcPhysicsInputs['isPaused']) {
    this.set({ isPaused });
  }

  @Input() set maxSubSteps(maxSubSteps: NgtcPhysicsInputs['maxSubSteps']) {
    this.set({ maxSubSteps });
  }

  @Input() set shouldInvalidate(shouldInvalidate: NgtcPhysicsInputs['shouldInvalidate']) {
    this.set({ shouldInvalidate });
  }

  @Input() set stepSize(stepSize: NgtcPhysicsInputs['stepSize']) {
    this.set({ stepSize });
  }

  ngOnInit() {
    this.physicsStore.set(
      this.select((s) => s, { debounce: true }).pipe(
        map((inputs) => ({ worker: new CannonWorkerAPI(inputs) }))
      )
    );
    this.connectWorker();
    this.setupBeforeRender();

    this.effect(
      tapEffect(() => {
        const subs: Subscription[] = [];
        subs.push(
          this.updateWorkerProp('axisIndex'),
          this.updateWorkerProp('broadphase'),
          this.updateWorkerProp('gravity'),
          this.updateWorkerProp('iterations'),
          this.updateWorkerProp('tolerance')
        );

        return () => {
          subs.forEach((sub) => sub.unsubscribe());
        };
      })
    )(this.physicsStore.select((s) => s.worker, { debounce: true }).pipe(filterFalsy()));
  }

  override ngOnDestroy() {
    const worker = this.physicsStore.get((s) => s.worker);
    if (worker) {
      worker.terminate();
      (worker as unknown as { removeAllListeners: NgtAnyFunction }).removeAllListeners();
    }

    super.ngOnDestroy();
  }

  private setupBeforeRender() {
    let timeSinceLastCalled = 0;
    this.effect<void>(
      tapEffect(() =>
        this.store
          .get((s) => s.internal)
          .subscribe(
            ({ delta }) => {
              const { isPaused, maxSubSteps, stepSize } = this.get();
              const worker = this.physicsStore.get((s) => s.worker);
              if (isPaused || !worker) return;
              timeSinceLastCalled += delta;
              worker.step({ maxSubSteps, timeSinceLastCalled, stepSize: stepSize! });
              timeSinceLastCalled = 0;
            },
            0,
            this.store
          )
      )
    )();
  }

  private connectWorker() {
    this.effect<CannonWorkerAPI>(
      tap(() => {
        const worker = this.physicsStore.get((s) => s.worker);
        worker.connect();
        worker.init();

        (worker as unknown as { on: NgtAnyFunction }).on('collide', this.collideHandler.bind(this));
        (worker as unknown as { on: NgtAnyFunction }).on(
          'collideBegin',
          this.collideBeginHandler.bind(this)
        );
        (worker as unknown as { on: NgtAnyFunction }).on(
          'collideEnd',
          this.collideEndHandler.bind(this)
        );
        (worker as unknown as { on: NgtAnyFunction }).on('frame', this.frameHandler.bind(this));
        (worker as unknown as { on: NgtAnyFunction }).on('rayhit', this.rayhitHandler.bind(this));
      })
    )(this.physicsStore.select((s) => s.worker, { debounce: true }).pipe(filterFalsy()));
  }

  private updateWorkerProp(prop: keyof NgtcPhysicsInputs) {
    return this.effect<NgtcPhysicsInputs[typeof prop]>(
      tap((value) => {
        const worker = this.physicsStore.get((s) => s.worker);
        if (worker) {
          (worker as NgtAnyRecord)[prop] = value;
        }
      })
    )(this.select((s) => s[prop]));
  }

  private collideHandler({
    body,
    contact: { bi, bj, ...contactRest },
    target,
    ...rest
  }: WorkerCollideEvent['data']) {
    const { events, refs } = this.physicsStore.get();
    const cb = events[target]?.collide;

    if (cb) {
      cb({
        body: refs[body],
        contact: { bi: refs[bi], bj: refs[bj], ...contactRest },
        target: refs[target],
        ...rest,
      });
    }
  }

  private collideBeginHandler({ bodyA, bodyB }: WorkerCollideBeginEvent['data']) {
    const { events, refs } = this.physicsStore.get();

    const cbA = events[bodyA]?.collideBegin;

    if (cbA) {
      cbA({
        body: refs[bodyB],
        op: 'event',
        target: refs[bodyA],
        type: 'collideBegin',
      });
    }

    const cbB = events[bodyB]?.collideBegin;
    if (cbB) {
      cbB({
        body: refs[bodyA],
        op: 'event',
        target: refs[bodyB],
        type: 'collideBegin',
      });
    }
  }

  private collideEndHandler({ bodyA, bodyB }: WorkerCollideEndEvent['data']) {
    const { events, refs } = this.physicsStore.get();

    const cbA = events[bodyA]?.collideEnd;

    if (cbA) {
      cbA({
        body: refs[bodyB],
        op: 'event',
        target: refs[bodyA],
        type: 'collideEnd',
      });
    }

    const cbB = events[bodyB]?.collideEnd;
    if (cbB) {
      cbB({
        body: refs[bodyA],
        op: 'event',
        target: refs[bodyB],
        type: 'collideEnd',
      });
    }
  }

  private frameHandler({
    active,
    bodies: uuids = [],
    observations,
    positions,
    quaternions,
  }: WorkerFrameMessage['data']) {
    const { bodies, subscriptions, refs, scaleOverrides } = this.physicsStore.get();
    const invalidate = this.store.get((s) => s.invalidate);
    const shouldInvalidate = this.get((s) => s.shouldInvalidate);

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
        if (ref instanceof InstancedMesh) {
          for (let i = 0; i < ref.count; i++) {
            const uuid = `${ref.uuid}/${i}`;
            const index = bodies[uuid];
            if (index !== undefined) {
              ref.setMatrixAt(i, apply(index, positions, quaternions, scaleOverrides[uuid]));
              ref.instanceMatrix.needsUpdate = true;
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
  }

  private rayhitHandler({ body, ray: { uuid, ...rayRest }, ...rest }: WorkerRayhitEvent['data']) {
    const { events, refs } = this.physicsStore.get();
    const cb = events[uuid]?.rayhit;

    if (cb) {
      cb({
        body: body ? refs[body] : null,
        ray: { uuid, ...rayRest },
        ...rest,
      });
    }
  }
}
