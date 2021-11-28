import * as THREE from 'three';
import type { NgtEventHandlers } from './events';
import type { NgtEventsStoreState } from './states/events-state';
import type { NgtState } from './states/state';

export interface NgtInstanceInternal {
  stateGetter: () => NgtState;
  eventsStateGetter: () => NgtEventsStoreState;
  handlers?: NgtEventHandlers;
  eventCount: number;
  linear: boolean;
}

export type NgtInstance = THREE.Object3D & { __ngt?: NgtInstanceInternal };
