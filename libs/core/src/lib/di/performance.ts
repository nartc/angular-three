import { InjectionToken } from '@angular/core';
import type { NgtPerformanceOptions } from '../types';

export const NGT_PERFORMANCE_OPTIONS =
    new InjectionToken<NgtPerformanceOptions>('NgtPerformance options', {
        factory: () => ({
            current: 1,
            min: 0.5,
            max: 1,
            debounce: 200,
        }),
    });
