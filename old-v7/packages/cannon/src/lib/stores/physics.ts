import { NgtComponentStore } from '@angular-three/core';
import { Injectable } from '@angular/core';
import {
  CannonWorkerAPI,
  CannonWorkerProps,
  CollideBeginEvent,
  CollideEndEvent,
  CollideEvent,
  RayhitEvent,
  Refs,
  Subscriptions,
} from '@pmndrs/cannon-worker-api';
import * as THREE from 'three';

export type NgtCannonEvent = CollideBeginEvent | CollideEndEvent | CollideEvent | RayhitEvent;
export type NgtCallbackByType<T extends { type: string }> = {
  [K in T['type']]?: T extends { type: K } ? (e: T) => void : never;
};

export type NgtCannonEvents = {
  [uuid: string]: Partial<NgtCallbackByType<NgtCannonEvent>>;
};

export type NgtScaleOverrides = { [uuid: string]: THREE.Vector3 };

export interface NgtPhysicsState {
  bodies: { [uuid: string]: number };
  events: NgtCannonEvents;
  refs: Refs;
  scaleOverrides: NgtScaleOverrides;
  subscriptions: Subscriptions;
  worker: CannonWorkerAPI;
}

@Injectable()
export class NgtPhysicsStore extends NgtComponentStore<NgtPhysicsState> {
  override initialize() {
    super.initialize();
    this.set({
      bodies: {},
      events: {},
      refs: {},
      scaleOverrides: {},
      subscriptions: {},
    });
  }

  get worker() {
    return this.getState((s) => s.worker);
  }

  init(inputs: CannonWorkerProps) {
    const {
      allowSleep,
      axisIndex,
      broadphase,
      defaultContactMaterial,
      frictionGravity,
      gravity,
      iterations,
      quatNormalizeFast,
      quatNormalizeSkip,
      size,
      solver,
      tolerance,
    } = inputs;

    this.set({
      worker: new CannonWorkerAPI({
        allowSleep,
        axisIndex,
        broadphase,
        defaultContactMaterial,
        frictionGravity,
        gravity,
        iterations,
        quatNormalizeFast,
        quatNormalizeSkip,
        size,
        solver,
        tolerance,
      }),
    });
  }
}
