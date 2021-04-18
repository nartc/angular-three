import type { Intersection, Raycaster } from 'three';
import type { RenderState } from './render';
import type { ThreeVector3 } from './three';

export type FilterFunction = (
  items: Intersection[],
  state: RenderState
) => Intersection[];
export type ComputeOffsetsFunction = <TEvent = unknown>(
  event: TEvent,
  state: RenderState
) => { offsetX: number; offsetY: number };

export interface ThreeRaycaster extends Raycaster {
  enabled: boolean;
  filter?: FilterFunction;
  computeOffsets?: ComputeOffsetsFunction;
}

export interface RaycasterOptions {
  origin?: ThreeVector3;
  direction?: ThreeVector3;
  near?: number;
  far?: number;
}
