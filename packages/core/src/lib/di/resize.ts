import { createInjectionToken } from '../utils/di';
import { injectNgtWindow } from './window';

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

export const [injectNgtResizeOptions, provideNgtResizeOptions] =
  createInjectionToken<NgtResizeOptions>('ngtResize Options', defaultResizeOptions);

export const [injectNgtResizeObserverSupport] = createInjectionToken<boolean>(
  'Resize Observer API support',
  () => !!injectNgtWindow().ResizeObserver
);
