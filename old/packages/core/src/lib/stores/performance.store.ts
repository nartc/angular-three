import { Injectable } from '@angular/core';
import { clearTimeout, setTimeout } from '@rx-angular/cdk/zone-less';
import { NgtPerformance } from '../types';
import { EnhancedRxState } from './enhanced-rx-state';
import { NgtStore } from './store';

let performanceTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

@Injectable()
export class NgtPerformanceStore extends EnhancedRxState<NgtPerformance> {
  constructor(store: NgtStore) {
    super();
    this.connect(store.select('performance'));
  }

  regress() {
    const { current, min, debounce } = this.get();
    // Clear timeout
    if (performanceTimeout) clearTimeout(performanceTimeout);
    // Set lower bound performance
    if (current !== min) this.set({ min });
    // Go back to upper bound performance after a while unless something regresses meanwhile
    performanceTimeout = setTimeout(() => {
      this.set({ current: this.get('max') });
    }, debounce);
  }
}
