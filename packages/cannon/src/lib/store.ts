import { createInject, NgtComponentStore } from '@angular-three/core-two';
import { Injectable, OnDestroy } from '@angular/core';
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

export type NgtcCannonEvent = CollideBeginEvent | CollideEndEvent | CollideEvent | RayhitEvent;
export type NgtcCallbackByType<T extends { type: string }> = {
  [K in T['type']]?: T extends { type: K } ? (e: T) => void : never;
};

export type NgtcCannonEvents = {
  [uuid: string]: Partial<NgtcCallbackByType<NgtcCannonEvent>>;
};

export type NgtcScaleOverrides = { [uuid: string]: THREE.Vector3 };

export interface NgtcPhysicsState {
  bodies: { [uuid: string]: number };
  events: NgtcCannonEvents;
  refs: Refs;
  scaleOverrides: NgtcScaleOverrides;
  subscriptions: Subscriptions;
  worker: CannonWorkerAPI;
  init: (inputs: CannonWorkerProps) => void;
}

@Injectable()
export class NgtcPhysicsStore extends NgtComponentStore<NgtcPhysicsState> implements OnDestroy {
  constructor() {
    super();
  }

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
}

export const injectNgtcPhysicsStore = createInject(NgtcPhysicsStore);
