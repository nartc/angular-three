import { inject, InjectionToken } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const WINDOW = new InjectionToken<Window & typeof globalThis>('window', {
    factory: () => {
        const { defaultView } = inject(DOCUMENT);

        if (!defaultView) {
            throw `window is not available!`;
        }

        return defaultView;
    },
});
