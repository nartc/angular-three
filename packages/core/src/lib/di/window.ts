import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { createInjection } from '../utils/inject';

export const [injectWindow] = createInjection<Window & typeof globalThis>('window', {
    defaultValueOrFactory: () => {
        const { defaultView } = inject(DOCUMENT);

        if (!defaultView) {
            throw `window is not available!`;
        }

        return defaultView;
    },
});
