import type { NgtColor } from '@angular-three/core';
import { Body } from 'cannon-es';

export interface NgtCannonDebugApi {
  update: () => void;
}

export interface NgtCannonDebugInfo {
  bodies: Body[];
  refs: { [uuid: string]: Body };
}

export interface NgtCannonDebugState extends NgtCannonDebugInfo {
  color?: NgtColor;
  scale?: number;
  impl?: typeof import('cannon-es-debugger').default;
}
