import { InjectionToken } from '@angular/core';
import { NgtPerformance } from '../models';

export const NGT_PERFORMANCE_OPTIONS = new InjectionToken<NgtPerformance>(
  'NgtPerformance options',
  {
    providedIn: 'root',
    factory: () => ({
      current: 1,
      min: 0.5,
      max: 1,
      debounce: 200,
    }),
  }
);
