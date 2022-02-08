import { Injectable } from '@angular/core';
import { noop } from 'rxjs';
import * as THREE from 'three';
import type {
  NgtDomEvent,
  NgtEvent,
  NgtEventsState,
  NgtPointerCaptureTarget,
  UnknownRecord,
} from '../types';
import { createEvents } from '../utils/events';
import { NgtCanvasStore } from './canvas';
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
export class NgtEventsStore extends NgtStore<NgtEventsState> {
  constructor(private canvasStore: NgtCanvasStore) {
    super();
    this.set({
      pointerMissed: noop,
      connected: false,
      handlers: {} as NgtEventsState['handlers'],
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
  }

  init(element: HTMLElement) {
    const { handlePointer } = createEvents(
      this.canvasStore.get.bind(this.canvasStore),
      this.get.bind(this)
    );

    this.set({
      handlers: Object.keys(names).reduce(
        (handlers: UnknownRecord, supportedEventName) => {
          handlers[supportedEventName] = handlePointer(supportedEventName);
          return handlers;
        },
        {}
      ) as NgtEventsState['handlers'],
    });

    this.connectElement(element);
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

  private connectElement(element: HTMLElement) {
    this.set({ connected: element });
    const handlers = this.get('handlers');
    Object.entries(handlers ?? {}).forEach(([eventName, handler]) => {
      const passive = names[eventName as keyof typeof names];
      element.addEventListener(eventName, handler, { passive });
    });
  }

  private disconnectElement() {
    const { handlers, connected } = this.get();
    if (connected) {
      Object.entries(handlers ?? {}).forEach(([eventName, handler]) => {
        if (connected instanceof HTMLElement) {
          connected.removeEventListener(eventName, handler);
        }
      });
    }
  }

  override ngOnDestroy() {
    this.disconnectElement();
    super.ngOnDestroy();
  }
}
