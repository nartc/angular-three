import { InjectionToken } from '@angular/core';
import { NgtCanvasOptions } from '../types';

const DEFAULT_NGT_CANVAS_OPTIONS: NgtCanvasOptions = {
  projectContent: false,
};

export const NGT_CANVAS_OPTIONS = new InjectionToken<NgtCanvasOptions>(
  'Canvas Options',
  {
    providedIn: 'root',
    factory: () => DEFAULT_NGT_CANVAS_OPTIONS,
  }
);

export function provideCanvasOptions(options: Partial<NgtCanvasOptions>) {
  return {
    ...DEFAULT_NGT_CANVAS_OPTIONS,
    ...(options || {}),
  };
}
