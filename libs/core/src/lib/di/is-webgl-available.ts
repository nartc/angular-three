import { DOCUMENT } from '@angular/common';
import { inject } from '@angular/core';
import { createInjection } from '../utils/inject';
import { injectWindow } from './window';

export const [injectIsWebGLAvailable, , NGT_IS_WEBGL_AVAILABLE] = createInjection<boolean>('isWebGLAvailable', {
  defaultValueOrFactory: () => {
    const document = inject(DOCUMENT);
    const window = injectWindow();

    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGL2RenderingContext && canvas.getContext('webgl2'));
    } catch (e) {
      return false;
    }
  },
});
