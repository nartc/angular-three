import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { createInjectionToken } from '../utils/di';

export const [injectNgtWindow] = createInjectionToken<Window & typeof globalThis>('Window', () => {
  const { defaultView } = inject(DOCUMENT);

  if (!defaultView) {
    throw `window is not available!`;
  }

  return defaultView;
});
