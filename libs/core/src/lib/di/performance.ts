import type { NgtPerformanceOptions } from '../types';
import { createInjection } from '../utils/inject';

const defaultPerformance = {
  current: 1,
  min: 0.5,
  max: 1,
  debounce: 200,
};

export const [injectPerformanceOptions, providePerformanceOptions, NGT_PERFORMANCE_OPTIONS] =
  createInjection<NgtPerformanceOptions>('NgtPerformance options', {
    defaultValueOrFactory: defaultPerformance,
    provideValueFactory: (value) => ({ ...defaultPerformance, ...value }),
  });
