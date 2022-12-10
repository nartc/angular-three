import type { StoreApi } from 'zustand/vanilla';
import type { NgtAnyRecord, NgtDomEvent, NgtEventManager, NgtEvents, NgtState } from './types';
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

export const supportedEvents = [
  'click',
  'contextmenu',
  'dblclick',
  'pointerup',
  'pointerdown',
  'pointerover',
  'pointerout',
  'pointerenter',
  'pointerleave',
  'pointermove',
  'pointermissed',
  'pointercancel',
  'wheel',
] as const;

export function createPointerEvents(store: StoreApi<NgtState>): NgtEventManager<HTMLElement> {
  const { handlePointer } = createEvents(store);

  return {
    priority: 1,
    enabled: true,
    compute: (event: NgtDomEvent, root: StoreApi<NgtState>) => {
      const state = root.getState();
      // https://github.com/pmndrs/react-three-fiber/pull/782
      // Events trigger outside of canvas when moved, use offsetX/Y by default and allow overrides
      state.pointer.set(
        (event.offsetX / state.size.width) * 2 - 1,
        -(event.offsetY / state.size.height) * 2 + 1
      );
      state.raycaster.setFromCamera(state.pointer, state.camera);
    },
    connected: undefined,
    handlers: Object.keys(DOM_EVENTS).reduce((handlers: NgtAnyRecord, supportedEventName) => {
      handlers[supportedEventName] = handlePointer(supportedEventName);
      return handlers;
    }, {}) as NgtEvents,
    connect: (target: HTMLElement) => {
      const state = store.getState();
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
      const { events, setEvents } = store.getState();
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
