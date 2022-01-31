import { Injectable } from '@angular/core';
import { NgtCanvasStore } from '../stores/canvas';
import {
  zonelessClearTimeout,
  zonelessRequestAnimationFrame,
  zonelessSetTimeout,
} from '../utils/zoneless-timer';

@Injectable()
export class NgtPerformance {
  constructor(private canvasStore: NgtCanvasStore) {}

  regress() {
    let timeoutId: ReturnType<typeof zonelessSetTimeout> | undefined =
      undefined;
    zonelessRequestAnimationFrame(() => {
      const { current, min, debounce } = this.canvasStore.get('performance');

      // clear timeout
      if (timeoutId) {
        zonelessClearTimeout(timeoutId);
        timeoutId = undefined;
      }

      // set lower bound
      if (current !== min)
        this.canvasStore.set((state) => ({
          ...state,
          performance: { ...state.performance, current: min },
        }));

      // go back to upper bound
      timeoutId = zonelessSetTimeout(() => {
        // performanceState.current = performanceSnapshot.max;
        this.canvasStore.set((state) => ({
          ...state,
          performance: { ...state.performance, current: state.performance.max },
        }));
      }, debounce);
    });
  }
}
