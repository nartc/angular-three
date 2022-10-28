import type {
  NgtDomEvent,
  NgtEventManager,
  NgtEvents,
  NgtStateGetter,
  UnknownRecord,
} from './types';
import { createEvents } from './utils/events';

const DOM_EVENTS = {
  click: false,
  contextmenu: false,
  dblclick: false,
  wheel: false, // passive wheel errors with OrbitControls
  pointerdown: true,
  pointerup: true,
  pointerleave: true,
  pointermove: true,
  pointercancel: true,
  lostpointercapture: true,
} as const;

export function createPointerEvents(
  stateGetter: NgtStateGetter
): NgtEventManager<HTMLElement> {
  const { handlePointer } = createEvents(stateGetter);

  return {
    priority: 1,
    enabled: true,
    compute: (event: NgtDomEvent, rootGetter: NgtStateGetter) => {
      const state = rootGetter();
      // https://github.com/pmndrs/react-three-fiber/pull/782
      // Events trigger outside of canvas when moved, use offsetX/Y by default and allow overrides
      state.pointer.set(
        (event.offsetX / state.size.width) * 2 - 1,
        -(event.offsetY / state.size.height) * 2 + 1
      );
      state.raycaster.setFromCamera(state.pointer, state.camera);
    },
    connected: undefined,
    handlers: Object.keys(DOM_EVENTS).reduce(
      (handlers: UnknownRecord, supportedEventName) => {
        handlers[supportedEventName] = handlePointer(supportedEventName);
        return handlers;
      },
      {}
    ) as NgtEvents,
    connect: (target: HTMLElement) => {
      const state = stateGetter();
      state.events.disconnect?.();

      state.setEvents({ connected: target });

      Object.entries(state.events.handlers ?? {}).forEach(
        ([eventName, eventHandler]: [string, EventListener]) => {
          const passive = DOM_EVENTS[eventName as keyof typeof DOM_EVENTS];
          target.addEventListener(eventName, eventHandler, { passive });
        }
      );
    },
    disconnect: () => {
      const { events, setEvents } = stateGetter();
      if (events.connected) {
        Object.entries(events.handlers ?? {}).forEach(
          ([eventName, eventHandler]: [string, EventListener]) => {
            if (events.connected instanceof HTMLElement) {
              events.connected.removeEventListener(eventName, eventHandler);
            }
          }
        );

        setEvents({ connected: undefined });
      }
    },
  };
}
