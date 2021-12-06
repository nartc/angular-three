import * as THREE from 'three';
import type { NgtDomEvent, NgtEvent } from '../events';
import type { NgtPointerCaptureTarget } from '../intersection';

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
  | 'pointermissed'
  | 'lostpointercapture';

export interface NgtEventsInternal {
  interaction: THREE.Object3D[];
  hovered: Map<string, NgtEvent<NgtDomEvent>>;
  capturedMap: Map<number, Map<THREE.Object3D, NgtPointerCaptureTarget>>;
  initialClick: [x: number, y: number];
  initialHits: THREE.Object3D[];
}

export interface NgtEventsStoreState {
  pointerMissed?: (event: MouseEvent) => void;
  connected: false | HTMLElement;
  internal: NgtEventsInternal;
  handlers?: Record<NgtSupportedEvents, EventListener>;
}
