import { NgtComponentStore, NgtStore, tapEffect } from '@angular-three/core';
import { Directive, NgModule, NgZone, OnInit } from '@angular/core';
import { tap } from 'rxjs';

@Directive({
  selector: 'ngt-soba-adaptive-events',
  standalone: true,
})
export class NgtSobaAdaptiveEvents extends NgtComponentStore implements OnInit {
  constructor(private zone: NgZone, private store: NgtStore) {
    super();
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.reset();
        this.updateEvents(this.store.select((s) => s.performance.current));
      });
    });
  }

  private readonly reset = this.effect<void>(
    tapEffect(() => {
      const enabled = this.store.get((s) => s.events.enabled);
      return () => {
        this.store.set((state) => ({ events: { ...state.events, enabled } }));
      };
    })
  );

  private updateEvents = this.effect<{}>(
    tap(() => {
      const current = this.store.get((s) => s.performance.current);
      this.store.set((state) => ({ events: { ...state.events, enabled: current === 1 } }));
    })
  );
}

@NgModule({
  imports: [NgtSobaAdaptiveEvents],
  exports: [NgtSobaAdaptiveEvents],
})
export class NgtSobaAdaptiveEventsModule {}
