import { Injectable, OnDestroy } from '@angular/core';
import { tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import type {
  EventsStoreState,
  NgtDomEvent,
  NgtPointerCaptureTarget,
} from '../models';
import { createEvents } from '../utils/events.util';
import { CanvasStore } from './canvas.store';
import { EnhancedComponentStore } from './enhanced-component-store.abstract';

const names = {
  click: false,
  contextmenu: false,
  dblclick: false,
  wheel: true,
  pointerdown: true,
  pointerup: true,
  pointerleave: true,
  pointermove: true,
  pointercancel: true,
  lostpointercapture: true,
} as const;

@Injectable()
export class EventsStore
  extends EnhancedComponentStore<EventsStoreState>
  implements OnDestroy
{
  constructor(private canvasStore: CanvasStore) {
    super({
      connected: false,
      internal: {
        interaction: [],
        hovered: new Map<string, NgtDomEvent>(),
        capturedMap: new Map<
          number,
          Map<THREE.Object3D, NgtPointerCaptureTarget>
        >(),
        initialClick: [0, 0],
        initialHits: [],
      },
    });
  }

  readonly initHandlersEffect = this.effect(($) =>
    $.pipe(
      tap(() => {
        const { handlePointer } = createEvents(
          () => this.canvasStore.getImperativeState(),
          () => this.getImperativeState()
        );

        this.patchState({
          handlers: Object.keys(names).reduce(
            (handlers, supportedEventName) => {
              handlers[supportedEventName] = handlePointer(supportedEventName);
              return handlers;
            },
            {} as Record<string, unknown>
          ) as EventsStoreState['handlers'],
        });
      })
    )
  );

  readonly connectEffect = this.effect<HTMLElement>((element$) =>
    element$.pipe(
      withLatestFrom(this.selectors.handlers$),
      tap(([element, handlers]) => {
        this.disconnectEffect();
        this.patchState({ connected: element });
        Object.entries(handlers ?? []).forEach(([name, event]) => {
          const passive = names[name as keyof typeof names];
          element.addEventListener(name, event, { passive });
        });
      })
    )
  );

  readonly disconnectEffect = this.effect(($) =>
    $.pipe(
      withLatestFrom(this.selectors.connected$, this.selectors.handlers$),
      tap(([, connected, handlers]) => {
        if (connected) {
          Object.entries(handlers ?? []).forEach(([name, event]) => {
            if (connected instanceof HTMLElement) {
              connected.removeEventListener(name, event);
            }
          });

          this.patchState({ connected: false });
        }
      })
    )
  );

  ngOnDestroy() {
    this.disconnectEffect();
    super.ngOnDestroy();
  }
}
