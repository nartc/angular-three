import * as THREE from 'packages/core/src/lib/models/three';
import type { NgtRender } from './render';
import type { NgtVector3 } from './three';

export type FilterFunction = (
  items: THREE.Intersection[],
  state: NgtRender
) => THREE.Intersection[];

export type ComputeOffsetsFunction = <TEvent = unknown>(
  event: TEvent,
  state: NgtRender
) => { offsetX: number; offsetY: number };

export interface NgtRaycaster extends THREE.Raycaster {
  enabled: boolean;
  filter?: FilterFunction;
  computeOffsets?: ComputeOffsetsFunction;
}

export interface NgtRaycasterOptions {
  origin?: NgtVector3;
  direction?: NgtVector3;
  near?: number;
  far?: number;
}
