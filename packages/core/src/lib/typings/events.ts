import type { ThreeIntersectionEvent } from './intersection';

export type ThreeEvent<TEvent> = TEvent & ThreeIntersectionEvent<TEvent>;
export type ThreeDomEvent = ThreeEvent<PointerEvent | MouseEvent | WheelEvent>;

export interface EventHandlers {
  click?: (event: ThreeEvent<MouseEvent>) => void;
  contextmenu?: (event: ThreeEvent<MouseEvent>) => void;
  dblclick?: (event: ThreeEvent<MouseEvent>) => void;
  pointerup?: (event: ThreeEvent<PointerEvent>) => void;
  pointerdown?: (event: ThreeEvent<PointerEvent>) => void;
  pointerover?: (event: ThreeEvent<PointerEvent>) => void;
  pointerout?: (event: ThreeEvent<PointerEvent>) => void;
  pointerenter?: (event: ThreeEvent<PointerEvent>) => void;
  pointerleave?: (event: ThreeEvent<PointerEvent>) => void;
  pointermove?: (event: ThreeEvent<PointerEvent>) => void;
  pointermissed?: (event: ThreeEvent<PointerEvent>) => void;
  pointercancel?: (event: ThreeEvent<PointerEvent>) => void;
  wheel?: (event: ThreeEvent<WheelEvent>) => void;
}
