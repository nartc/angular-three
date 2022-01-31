import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';

export const NGT_IS_WEBGL_AVAILABLE = new InjectionToken<boolean>(
  'isWebGLAvailable',
  {
    providedIn: 'root',
    factory: () => {
      const document = inject(DOCUMENT);
      try {
        const canvas = document.createElement('canvas');
        return !!(
          document.defaultView?.WebGL2RenderingContext &&
          canvas.getContext('webgl2')
        );
      } catch (e) {
        return false;
      }
    },
  }
);
