import {
  coerceBoolean,
  coerceNumber,
  NgtAnyFunction,
  NgtBooleanInput,
  NgtComponentStore,
  NgtNumberInput,
  NgtObservableInput,
  NgtStore,
  NgtUnknownRecord,
  skipFirstUndefined,
  tapEffect,
} from '@angular-three/core';
import { Component, inject, Input, NgZone, OnInit } from '@angular/core';
import {
  Broadphase,
  CannonWorkerProps,
  ContactMaterialOptions,
  Solver,
  Triplet,
  WorkerCollideBeginEvent,
  WorkerCollideEndEvent,
  WorkerCollideEvent,
  WorkerFrameMessage,
  WorkerRayhitEvent,
} from '@pmndrs/cannon-worker-api';
import { isObservable, map, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtPhysicsStore } from './stores/physics';

const v = new THREE.Vector3();
const s = new THREE.Vector3(1, 1, 1);
const q = new THREE.Quaternion();
const m = new THREE.Matrix4();

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

export interface NgtPhysicsInputs extends CannonWorkerProps {
  isPaused?: boolean;
  maxSubSteps?: number;
  shouldInvalidate?: boolean;
  stepSize?: number;
}

@Component({
  selector: 'ngt-physics',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [NgtPhysicsStore],
})
export class NgtPhysics extends NgtComponentStore<NgtPhysicsInputs> implements OnInit {
  private readonly zone = inject(NgZone);
  private readonly store = inject(NgtStore);
  private readonly physicsStore = inject(NgtPhysicsStore, { self: true });

  @Input() set allowSleep(allowSleep: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      allowSleep: isObservable(allowSleep) ? allowSleep.pipe(map(coerceBoolean)) : coerceBoolean(allowSleep),
    });
  }

  @Input() set axisIndex(axisIndex: NgtObservableInput<0 | 1 | 2>) {
    this.set({ axisIndex });
  }

  @Input() set broadphase(broadphase: NgtObservableInput<Broadphase>) {
    this.set({ broadphase });
  }

  @Input() set defaultContactMaterial(defaultContactMaterial: NgtObservableInput<ContactMaterialOptions>) {
    this.set({ defaultContactMaterial });
  }

  @Input() set frictionGravity(frictionGravity: NgtObservableInput<Triplet | null>) {
    this.set({ frictionGravity });
  }

  @Input() set gravity(gravity: NgtObservableInput<Triplet>) {
    this.set({ gravity });
  }

  @Input() set iterations(iterations: NgtObservableInput<NgtNumberInput>) {
    this.set({
      iterations: isObservable(iterations) ? iterations.pipe(map(coerceNumber)) : coerceNumber(iterations),
    });
  }

  @Input() set quatNormalizeFast(quatNormalizeFast: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      quatNormalizeFast: isObservable(quatNormalizeFast)
        ? quatNormalizeFast.pipe(map(coerceBoolean))
        : coerceBoolean(quatNormalizeFast),
    });
  }

  @Input() set quatNormalizeSkip(quatNormalizeSkip: NgtObservableInput<NgtNumberInput>) {
    this.set({
      quatNormalizeSkip: isObservable(quatNormalizeSkip)
        ? quatNormalizeSkip.pipe(map(coerceNumber))
        : coerceNumber(quatNormalizeSkip),
    });
  }

  @Input() set solver(solver: Solver) {
    this.set({ solver });
  }

  @Input() set tolerance(tolerance: NgtObservableInput<NgtNumberInput>) {
    this.set({
      tolerance: isObservable(tolerance) ? tolerance.pipe(map(coerceNumber)) : coerceNumber(tolerance),
    });
  }

  @Input() set size(size: NgtObservableInput<NgtNumberInput>) {
    this.set({
      size: isObservable(size) ? size.pipe(map(coerceNumber)) : coerceNumber(size),
    });
  }

  @Input() set isPaused(isPaused: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      isPaused: isObservable(isPaused) ? isPaused.pipe(map(coerceBoolean)) : coerceBoolean(isPaused),
    });
  }

  @Input() set maxSubSteps(maxSubSteps: NgtObservableInput<NgtNumberInput>) {
    this.set({
      maxSubSteps: isObservable(maxSubSteps) ? maxSubSteps.pipe(map(coerceNumber)) : coerceNumber(maxSubSteps),
    });
  }

  @Input() set shouldInvalidate(shouldInvalidate: NgtObservableInput<NgtBooleanInput>) {
    this.set({
      shouldInvalidate: isObservable(shouldInvalidate)
        ? shouldInvalidate.pipe(map(coerceBoolean))
        : coerceBoolean(shouldInvalidate),
    });
  }

  @Input() set stepSize(stepSize: NgtObservableInput<NgtNumberInput>) {
    this.set({
      stepSize: isObservable(stepSize) ? stepSize.pipe(map(coerceNumber)) : coerceNumber(stepSize),
    });
  }

  private readonly setBeforeRender = this.effect<void>(
    tapEffect(() => {
      let timeSinceLastCalled = 0;
      return this.store.registerBeforeRender({
        callback: ({ delta }) => {
          const { isPaused, maxSubSteps, stepSize } = this.getState();
          const worker = this.physicsStore.getState((s) => s.worker);
          if (isPaused || !worker) return;
          timeSinceLastCalled += delta;
          worker.step({
            maxSubSteps,
            stepSize: stepSize!,
            timeSinceLastCalled,
          });
          timeSinceLastCalled = 0;
        },
      });
    })
  );

  private readonly connectWorker = this.effect(
    tapEffect(() => {
      const worker = this.physicsStore.getState((s) => s.worker);
      worker.connect();
      worker.init();

      (worker as unknown as { on: NgtAnyFunction }).on('collide', this.collideHandler.bind(this));
      (worker as unknown as { on: NgtAnyFunction }).on('collideBegin', this.collideBeginHandler.bind(this));
      (worker as unknown as { on: NgtAnyFunction }).on('collideEnd', this.collideEndHandler.bind(this));
      (worker as unknown as { on: NgtAnyFunction }).on('frame', this.frameHandler.bind(this));
      (worker as unknown as { on: NgtAnyFunction }).on('rayhit', this.rayhitHandler.bind(this));

      return () => {
        worker.terminate();
        (worker as unknown as { removeAllListeners: () => void }).removeAllListeners();
      };
    })
  );

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

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.physicsStore.init(this.getState());

      this.setBeforeRender();
      this.connectWorker(this.physicsStore.select((s) => s.worker).pipe(skipFirstUndefined()));

      this.updateWorkerProp('axisIndex');
      this.updateWorkerProp('broadphase');
      this.updateWorkerProp('gravity');
      this.updateWorkerProp('iterations');
      this.updateWorkerProp('tolerance');
    });
  }

  private updateWorkerProp(prop: keyof NgtPhysicsInputs) {
    this.effect(
      tap(() => {
        const worker = this.physicsStore.getState((s) => s.worker);
        if (!worker) return;
        (worker as unknown as NgtUnknownRecord)[prop] = this.getState((s) => s[prop]);
      })
    )(
      this.select(
        this.physicsStore.select((s) => s.worker),
        this.select((s) => s[prop]),
        this.defaultProjector,
        { debounce: true }
      )
    );
  }

  private collideHandler({ body, contact: { bi, bj, ...contactRest }, target, ...rest }: WorkerCollideEvent['data']) {
    const { events, refs } = this.physicsStore.getState();
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
    const { events, refs } = this.physicsStore.getState();

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
    const { events, refs } = this.physicsStore.getState();

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
    const { bodies, subscriptions, refs, scaleOverrides } = this.physicsStore.getState();
    const invalidate = this.store.getState((s) => s.invalidate);
    const shouldInvalidate = this.getState((s) => s.shouldInvalidate);

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
    const { events, refs } = this.physicsStore.getState();
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
