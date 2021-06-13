import type { Object3D } from 'three';
import type { ThreeDomEvent } from '../events';
import type { ThreeIntersection } from '../intersection';

export type SupportedEvents =
  | 'click'
  | 'contextmenu'
  | 'dblclick'
  | 'wheel'
  | 'pointerdown'
  | 'pointerup'
  | 'pointerleave'
  | 'pointermove'
  | 'pointercancel'
  | 'lostpointercapture';

export interface EventsInternal {
  interaction: Object3D[];
  hovered: Map<string, ThreeDomEvent>;
  capturedMap: Map<number, Map<Object3D, ThreeIntersection>>;
  initialClick: [x: number, y: number];
  initialHits: Object3D[];
}

export interface EventsStoreState {
  connected: false | HTMLElement;
  internal: EventsInternal;
  handlers?: Record<SupportedEvents, EventListener>;
}
