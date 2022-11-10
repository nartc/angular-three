import type { NgtUnknownRecord } from '../types';
import { createInjection } from '../utils/inject';
import { injectWindow } from './window';

export interface NgtResizeOptions {
  box: ResizeObserverBoxOptions;
  debounce: number | { scroll: number; resize: number };
  scroll: boolean;
  offsetSize: boolean;
}

export const defaultResizeOptions: NgtResizeOptions = {
  box: 'content-box',
  scroll: false,
  offsetSize: false,
  debounce: { scroll: 50, resize: 0 },
};

export const [injectResizeOptions, provideResizeOptions, NGT_RESIZE_OPTIONS] = createInjection<NgtResizeOptions>(
  'ngtResize Options',
  {
    defaultValueOrFactory: defaultResizeOptions,
    provideValueFactory: (value) => ({ ...defaultResizeOptions, ...value }),
  }
);

export const [injectResizeObserverSupport] = createInjection<boolean>('Resize Observer API support', {
  defaultValueOrFactory: () => {
    const window = injectWindow();
    return 'ResizeObserver' in window && (window as unknown as NgtUnknownRecord)['ResizeObserver'] != null;
  },
});
