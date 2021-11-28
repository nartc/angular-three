import type { NgtIntersectionEvent } from './intersection';

export type NgtEvent<TEvent> = NgtIntersectionEvent<TEvent>;
export type NgtDomEvent = PointerEvent | MouseEvent | WheelEvent;

export interface NgtEventHandlers {
  click?: (event: NgtEvent<MouseEvent>) => void;
  contextmenu?: (event: NgtEvent<MouseEvent>) => void;
  dblclick?: (event: NgtEvent<MouseEvent>) => void;
  pointerup?: (event: NgtEvent<PointerEvent>) => void;
  pointerdown?: (event: NgtEvent<PointerEvent>) => void;
  pointerover?: (event: NgtEvent<PointerEvent>) => void;
  pointerout?: (event: NgtEvent<PointerEvent>) => void;
  pointerenter?: (event: NgtEvent<PointerEvent>) => void;
  pointerleave?: (event: NgtEvent<PointerEvent>) => void;
  pointermove?: (event: NgtEvent<PointerEvent>) => void;
  pointermissed?: (event: MouseEvent) => void;
  pointercancel?: (event: NgtEvent<PointerEvent>) => void;
  wheel?: (event: NgtEvent<WheelEvent>) => void;
}
