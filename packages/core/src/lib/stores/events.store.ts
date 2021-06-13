import { Injectable, OnDestroy } from '@angular/core';
import { tap } from 'rxjs/operators';
import type { Object3D } from 'three';
import type {
  EventsStoreState,
  ThreeDomEvent,
  ThreeIntersection,
} from '../typings';
import { createEvents } from '../utils';
import { CanvasStore } from './canvas.store';
import { ImperativeComponentStore } from './imperative-component-store.abstract';
import { InstancesStore } from './instances.store';

const events = {
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
  extends ImperativeComponentStore<EventsStoreState>
  implements OnDestroy
{
  constructor(
    private readonly canvasStore: CanvasStore,
    private readonly instancesStore: InstancesStore
  ) {
    super({
      connected: false,
      internal: {
        interaction: [],
        hovered: new Map<string, ThreeDomEvent>(),
        capturedMap: new Map<number, Map<Object3D, ThreeIntersection>>(),
        initialClick: [0, 0],
        initialHits: [],
      },
    });
    this.initHandlersEffect();
  }

  readonly initHandlersEffect = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        const { handlePointer } = createEvents(
          () => this.canvasStore.getImperativeState(),
          () => this.getImperativeState(),
          () => this.instancesStore.getImperativeState()
        );
        this.patchState({
          handlers: Object.keys(events).reduce(
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

  readonly connectEffect = this.effect<HTMLElement>((target$) =>
    target$.pipe(
      tap((target: HTMLElement) => {
        this.disconnectEffect();
        const { handlers } = this.getImperativeState();
        this.patchState({ connected: target });
        Object.entries(handlers ?? []).forEach(([name, event]) => {
          const passive = events[name as keyof typeof events];
          target.addEventListener(name, event, { passive });
        });
      })
    )
  );

  readonly disconnectEffect = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        const { handlers, connected } = this.getImperativeState();
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
