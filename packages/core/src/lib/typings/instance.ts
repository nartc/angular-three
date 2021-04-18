import type { Object3D } from 'three';
import type { EventHandlers } from './events';
import type { CanvasStoreState, EventsStoreState } from './stores';

export interface InstanceInternal {
  canvasStateGetter: () => CanvasStoreState;
  eventsStateGetter: () => EventsStoreState;
  handlers?: EventHandlers;
}

export type ThreeInstance = Object3D & { __ngt?: InstanceInternal };
