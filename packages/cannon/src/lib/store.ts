import { createInject } from '@angular-three/core';
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
import { RxState } from '@rx-angular/state';

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
export class NgtcPhysicsStore extends RxState<NgtcPhysicsState> implements OnDestroy {
  constructor() {
    super();
    this.set({
      bodies: {},
      events: {},
      refs: {},
      scaleOverrides: {},
      subscriptions: {},
    });
  }

  init(inputs: CannonWorkerProps) {
    this.set({ worker: new CannonWorkerAPI(inputs) });
  }
}

export const injectNgtcPhysicsStore = createInject(NgtcPhysicsStore);
