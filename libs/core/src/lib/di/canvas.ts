import { InjectionToken, Provider } from '@angular/core';
import type { NgtCanvasOptions } from '../types';

const DEFAULT_NGT_CANVAS_OPTIONS: NgtCanvasOptions = {
    initialLog: false,
    projectContent: false,
};

export const NGT_CANVAS_OPTIONS = new InjectionToken<NgtCanvasOptions>(
    'Canvas Options',
    {
        factory: () => DEFAULT_NGT_CANVAS_OPTIONS,
    }
);

/**
 *
 * @deprecated Please use the [initialLog] and [projectContent] on `ngt-canvas` instead. Will be removed in V5
 */
export function provideCanvasOptions(
    options: Partial<NgtCanvasOptions>
): Provider {
    return {
        provide: NGT_CANVAS_OPTIONS,
        useValue: {
            ...DEFAULT_NGT_CANVAS_OPTIONS,
            ...options,
        },
    };
}
