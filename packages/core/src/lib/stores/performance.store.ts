import { Injectable, NgZone } from '@angular/core';
import { tap } from 'rxjs';
import { NgtPerformance, PerformanceStoreState } from '../models';
import { EnhancedComponentStore } from './enhanced-component-store.abstract';

let performanceTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

@Injectable()
export class PerformanceStore extends EnhancedComponentStore<PerformanceStoreState> {
  constructor(private ngZone: NgZone) {
    super({
      current: 1,
      min: 0.5,
      max: 1,
      debounce: 200,
      regress: () => {
        const state = this.getImperativeState();
        // Clear timeout
        if (performanceTimeout) clearTimeout(performanceTimeout);
        // Set lower bound performance
        if (state.current !== state.min) this.updaters.setCurrent(state.min);
        // Go back to upper bound performance after a while unless something regresses meanwhile
        performanceTimeout = setTimeout(() => {
          const { max } = this.getImperativeState();
          this.updaters.setCurrent(max);
        }, state.debounce);
      },
    });
  }

  readonly setPerformance = this.effect<NgtPerformance>((performance$) =>
    performance$.pipe(
      tap(({ current, debounce, max, min }) => {
        this.ngZone.runOutsideAngular(() => {
          if (current != null) this.updaters.setCurrent(current);
          if (debounce != null) this.updaters.setDebounce(debounce);
          if (max != null) this.updaters.setMax(max);
          if (min != null) this.updaters.setMin(min);
        });
      })
    )
  );
}
