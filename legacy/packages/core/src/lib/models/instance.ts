import * as THREE from 'packages/core/src/lib/models/three';
import type { CanvasStoreState } from './canvas-state';
import type { NgtEventHandlers } from './events';
import type { EventsStoreState } from './events-state';

export interface NgtInstanceInternal {
  canvasStateGetter: () => CanvasStoreState;
  eventsStateGetter: () => EventsStoreState;
  handlers?: NgtEventHandlers;
  eventCount: number;
  linear: boolean;
}

export type NgtInstance = THREE.Object3D & { __ngt?: NgtInstanceInternal };
