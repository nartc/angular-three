import type { Size } from './size';

export type Viewport = Size & {
  initialDpr: number;
  dpr: number;
  factor: number;
  distance: number;
  aspect: number;
};
