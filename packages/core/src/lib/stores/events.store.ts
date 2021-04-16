import { EventsStoreState, ThreeDomEvent } from '@angular-three/core/typings';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { createEvents } from '../utils';
import { CanvasStore } from './canvas.store';
import { ImperativeComponentStore } from './imperative-component-store.abstract';
import { InstancesStore } from './instances.store';

const supportedEvents = [
  'click',
  'contextmenu',
  'dblclick',
  'wheel',
  'pointerdown',
  'pointerup',
  'pointerleave',
  'pointermove',
  'pointercancel',
  'lostpointercapture',
];

@Injectable()
export class EventsStore extends ImperativeComponentStore<EventsStoreState> {
  constructor(
    private readonly canvasStore: CanvasStore,
    private readonly instancesStore: InstancesStore
  ) {
    super({
      connected: false,
      internal: {
        interaction: [],
        hovered: new Map<string, ThreeDomEvent>(),
        captured: undefined,
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
          handlers: supportedEvents.reduce(
            (handlers, supportedEventName) => ({
              ...handlers,
              [supportedEventName]: handlePointer(supportedEventName),
            }),
            {}
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
        Object.entries(handlers ?? []).forEach(([name, event]) =>
          target.addEventListener(name, event, { passive: true })
        );
        this.patchState({ connected: target });
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
