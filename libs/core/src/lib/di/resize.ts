import { inject, InjectionToken, Provider } from '@angular/core';
import { WINDOW } from './window';

export interface NgtResizeOptions {
    box: ResizeObserverBoxOptions;
    debounce: number | { scroll: number; resize: number };
    scroll: boolean;
    offsetSize: boolean;
}

export const NGT_RESIZE_BOX_DEFAULT = 'content-box';
export const NGT_RESIZE_DEBOUNCE_DEFAULT = 200;
export const NGT_RESIZE_OPTIONS = new InjectionToken<NgtResizeOptions>(
    'ngtResizeObserver Options',
    {
        factory: () => ({
            box: NGT_RESIZE_BOX_DEFAULT,
            scroll: false,
            offsetSize: false,
            debounce: NGT_RESIZE_DEBOUNCE_DEFAULT,
        }),
    }
);

export function provideResizeOptions(
    resizeOptions: Partial<NgtResizeOptions>
): Provider {
    return {
        provide: NGT_RESIZE_OPTIONS,
        useValue: {
            ...resizeOptions,
            box: NGT_RESIZE_BOX_DEFAULT,
            scroll: false,
            offsetSize: false,
            debounce: NGT_RESIZE_DEBOUNCE_DEFAULT,
        },
    };
}

export const NGT_RESIZE_OBSERVER_SUPPORT = new InjectionToken<boolean>(
    'Resize Observer API support',
    {
        factory: () => {
            const window = inject(WINDOW);
            return (
                'ResizeObserver' in window &&
                (window as unknown as Record<string, unknown>)[
                    'ResizeObserver'
                ] != null
            );
        },
    }
);
