import { Injectable, NgZone } from '@angular/core';
import { noop } from 'rxjs';
import * as THREE from 'three';
import {
  NgtDomEvent,
  NgtEvent,
  NgtEventsStoreState,
  NgtPointerCaptureTarget,
  UnknownRecord,
} from '../types';
import { createEvents } from '../utils/events';
import { EnhancedRxState } from './enhanced-rx-state';
import { NgtStore } from './store';

const names = {
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

@Injectable()
export class NgtEventsStore extends EnhancedRxState<
  NgtEventsStoreState,
  { element: HTMLElement }
> {
  actions = this.create();

  constructor(private store: NgtStore, private ngZone: NgZone) {
    super();
    this.set({
      pointerMissed: noop,
      connected: false,
      handlers: {} as NgtEventsStoreState['handlers'],
      internal: {
        interaction: [],
        hovered: new Map<string, NgtEvent<NgtDomEvent>>(),
        capturedMap: new Map<
          number,
          Map<THREE.Object3D, NgtPointerCaptureTarget>
        >(),
        initialClick: [0, 0],
        initialHits: [],
      },
    });

    ngZone.runOutsideAngular(() => {
      const { handlePointer } = createEvents(
        this.store.get.bind(this.store),
        this.get.bind(this)
      );

      this.set({
        handlers: Object.keys(names).reduce(
          (handlers: UnknownRecord, supportedEventName) => {
            handlers[supportedEventName] = handlePointer(supportedEventName);
            return handlers;
          },
          {}
        ) as NgtEventsStoreState['handlers'],
      });

      this.holdEffect(this.actions.element$, this.#connect.bind(this));
    });
  }

  addInteraction(interaction: THREE.Object3D) {
    this.set((state) => ({
      ...state,
      internal: {
        ...state.internal,
        interaction: [...state.internal.interaction, interaction],
      },
    }));
  }

  removeInteraction(uuid: string) {
    this.set((state) => ({
      ...state,
      internal: {
        ...state.internal,
        interaction: state.internal.interaction.filter(
          (interaction) => interaction.uuid !== uuid
        ),
      },
    }));
  }

  #connect(element: HTMLElement) {
    return this.ngZone.runOutsideAngular(() => {
      this.set({ connected: element });
      const handlers = this.get('handlers');
      Object.entries(handlers ?? {}).forEach(([eventName, handler]) => {
        const passive = names[eventName as keyof typeof names];
        element.addEventListener(eventName, handler, { passive });
      });

      return () => {
        const { handlers, connected } = this.get();
        if (connected) {
          Object.entries(handlers ?? {}).forEach(([eventName, handler]) => {
            if (connected instanceof HTMLElement) {
              connected.removeEventListener(eventName, handler);
            }
          });
        }
      };
    });
  }
}
