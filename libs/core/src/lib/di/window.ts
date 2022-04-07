import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

export const WINDOW = new InjectionToken<Window & typeof globalThis>('window', {
    factory: () => {
        const { defaultView } = inject(DOCUMENT);

        if (!defaultView) {
            throw `window is not available!`;
        }

        return defaultView;
    },
});
