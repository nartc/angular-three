import type { Object3D } from 'three';
import type { NgtDomEvent } from './events';
import type { NgtIntersection } from './intersection';

export type NgtSupportedEvents =
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

export interface NgtEventsInternal {
  interaction: Object3D[];
  hovered: Map<string, NgtDomEvent>;
  capturedMap: Map<number, Map<Object3D, NgtIntersection>>;
  initialClick: [x: number, y: number];
  initialHits: Object3D[];
}

export interface EventsStoreState {
  connected: false | HTMLElement;
  internal: NgtEventsInternal;
  handlers?: Record<NgtSupportedEvents, EventListener>;
}
