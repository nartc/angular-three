import type { NgtSize } from './size';

export type NgtViewport = NgtSize & {
  initialDpr: number;
  dpr: number;
  factor: number;
  distance: number;
  aspect: number;
};
