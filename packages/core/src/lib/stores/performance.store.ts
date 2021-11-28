import { Injectable, NgZone } from '@angular/core';
import { tap } from 'rxjs';
import { NgtPerformance } from '../models';
import { NgtCanvasInputsStore } from './canvas-inputs.store';
import { EnhancedComponentStore } from './enhanced-component-store';

let performanceTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

@Injectable()
export class NgtPerformanceStore extends EnhancedComponentStore<NgtPerformance> {
  constructor(
    private canvasInputsStore: NgtCanvasInputsStore,
    private ngZone: NgZone
  ) {
    super(canvasInputsStore.getImperativeState().performance);
  }

  readonly init = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.ngZone.runOutsideAngular(() => {
          this.setPerformance(this.canvasInputsStore.selectors.performance$);
        });
      })
    )
  );

  private readonly setPerformance = this.effect<NgtPerformance>(
    (performance$) =>
      performance$.pipe(
        tap(({ min, max, debounce, current }) => {
          this.ngZone.runOutsideAngular(() => {
            this.updaters.setCurrent(current);
            this.updaters.setMin(min);
            this.updaters.setMax(max);
            this.updaters.setDebounce(debounce);
          });
        })
      )
  );

  readonly regress = this.effect(($) =>
    $.pipe(
      tap(() => {
        this.ngZone.runOutsideAngular(() => {
          const { current, min, debounce } = this.getImperativeState();
          // Clear timeout
          if (performanceTimeout) clearTimeout(performanceTimeout);
          // Set lower bound performance
          if (current !== min) this.updaters.setCurrent(min);
          // Go back to upper bound performance after a while unless something regresses meanwhile
          performanceTimeout = setTimeout(() => {
            this.updaters.setCurrent(this.getImperativeState().max);
          }, debounce);
        });
      })
    )
  );
}
