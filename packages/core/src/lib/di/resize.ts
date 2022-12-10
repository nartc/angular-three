import { createInjectionToken } from '../utils/di';
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

export const [injectResizeOptions, provideResizeOptions] = createInjectionToken<NgtResizeOptions>(
    'ngtResize Options',
    defaultResizeOptions
);

export const [injectResizeObserverSupport] = createInjectionToken<boolean>(
    'Resize Observer API support',
    () => !!injectWindow().ResizeObserver
);
