import { Injectable, NgZone } from '@angular/core';
import { noop, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import {
  NgtDomEvent,
  NgtEvent,
  NgtEventsStoreState,
  NgtPointerCaptureTarget,
} from '../models';
import { createEvents } from '../utils/events';
import { EnhancedComponentStore, tapEffect } from './enhanced-component-store';
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
export class NgtEventsStore extends EnhancedComponentStore<NgtEventsStoreState> {
  constructor(private store: NgtStore, private ngZone: NgZone) {
    super({
      pointermissed: noop,
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
  }

  readonly init = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.ngZone.runOutsideAngular(() => {
          const { handlePointer } = createEvents(
            () => this.store.getImperativeState(),
            () => this.getImperativeState()
          );

          this.patchState({
            handlers: Object.keys(names).reduce(
              (handlers, supportedEventName) => {
                handlers[supportedEventName] =
                  handlePointer(supportedEventName);
                return handlers;
              },
              {} as Record<string, unknown>
            ) as NgtEventsStoreState['handlers'],
          });
        });
      })
    )
  );

  readonly addInteraction = this.updater<THREE.Object3D>(
    (state, interaction) => ({
      ...state,
      internal: {
        ...state.internal,
        interaction: [...state.internal.interaction, interaction],
      },
    })
  );

  readonly removeInteraction = this.updater<string>((state, uuid) => ({
    ...state,
    internal: {
      ...state.internal,
      interaction: state.internal.interaction.filter(
        (obj) => obj.uuid !== uuid
      ),
    },
  }));

  readonly connect = this.effect<HTMLElement>((element$) =>
    element$.pipe(
      withLatestFrom(this.selectors.handlers$),
      tapEffect(([element, handlers]) => {
        this.ngZone.runOutsideAngular(() => {
          this.patchState({ connected: element });
          Object.entries(handlers ?? {}).forEach(
            ([eventName, eventHandler]) => {
              const passive = names[eventName as keyof typeof names];
              element.addEventListener(eventName, eventHandler, { passive });
            }
          );
        });

        return () => {
          this.ngZone.runOutsideAngular(() => {
            const { connected, handlers } = this.getImperativeState();
            if (connected) {
              Object.entries(handlers ?? {}).forEach(
                ([eventName, eventHandler]) => {
                  if (connected instanceof HTMLElement) {
                    connected.removeEventListener(eventName, eventHandler);
                  }
                }
              );
            }
          });
        };
      })
    )
  );
}
