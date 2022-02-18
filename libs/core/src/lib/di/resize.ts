import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

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
export const NGT_RESIZE_OBSERVER_SUPPORT = new InjectionToken<boolean>(
    'Resize Observer API support',
    {
        factory: () => {
            const document = inject(DOCUMENT);
            return (
                !!document.defaultView &&
                'ResizeObserver' in document.defaultView &&
                (document.defaultView as unknown as Record<string, unknown>)[
                    'ResizeObserver'
                ] != null
            );
        },
    }
);
