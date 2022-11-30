import { NgtComponentStore, NgtStore, tapEffect } from '@angular-three/core';
import { Directive, inject, NgZone, OnInit } from '@angular/core';
import { tap } from 'rxjs';

@Directive({
    selector: 'ngt-soba-adaptive-events',
    standalone: true,
})
export class SobaAdaptiveEvents extends NgtComponentStore implements OnInit {
    private readonly zone = inject(NgZone);
    private readonly store = inject(NgtStore);

    private readonly reset = this.effect<void>(
        tapEffect(() => {
            const enabled = this.store.read((s) => s.events.enabled);
            return () => {
                this.store.write((state) => ({ events: { ...state.events, enabled } }));
            };
        })
    );

    private updateEvents = this.effect(
        tap(() => {
            const current = this.store.read((s) => s.performance.current);
            this.store.write((state) => ({ events: { ...state.events, enabled: current === 1 } }));
        })
    );

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.reset();
            this.updateEvents(this.store.select((s) => s.performance, { debounce: true }));
        });
    }
}
