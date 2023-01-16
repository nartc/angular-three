import { injectNgtStore, NgtRxStore } from '@angular-three/core';
import { Directive, inject, OnInit } from '@angular/core';
import { RxActionFactory } from '@rx-angular/state/actions';

@Directive({
    selector: 'ngts-adaptive-events',
    standalone: true,
    providers: [RxActionFactory],
})
export class NgtsAdaptiveEvents extends NgtRxStore implements OnInit {
    readonly #store = injectNgtStore();
    readonly #actions = inject(RxActionFactory<{ setEvents: void }>).create();

    ngOnInit(): void {
        this.effect(this.#actions.setEvents$, () => {
            const enabled = this.#store.get('events', 'enabled');
            return () => {
                const setEvents = this.#store.get('setEvents');
                setEvents({ enabled });
            };
        });
        this.#actions.setEvents();

        this.effect(this.#store.select('performance', 'current'), (current) => {
            const setEvents = this.#store.get('setEvents');
            setEvents({ enabled: current === 1 });
        });
    }
}
