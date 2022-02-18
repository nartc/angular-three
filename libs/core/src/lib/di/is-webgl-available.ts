import { DOCUMENT } from '@angular/common';
import { inject, InjectionToken } from '@angular/core';
import { WINDOW } from './window';

export const NGT_IS_WEBGL_AVAILABLE = new InjectionToken<boolean>(
    'isWebGLAvailable',
    {
        factory: () => {
            const document = inject(DOCUMENT);
            const window = inject(WINDOW);
            try {
                const canvas = document.createElement('canvas');
                return !!(
                    window.WebGL2RenderingContext && canvas.getContext('webgl2')
                );
            } catch (e) {
                return false;
            }
        },
    }
);
