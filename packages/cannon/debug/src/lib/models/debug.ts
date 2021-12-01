import { NgtColor } from '@angular-three/core';
import { Body } from 'cannon-es';
import { DebugOptions } from 'cannon-es-debugger';
import * as THREE from 'three';

export interface NgtCannonDebugApi {
  update: () => void;
}

export type NgtCannonDebuggerInterface = (
  scene: THREE.Scene,
  bodies: Body[],
  props?: DebugOptions
) => NgtCannonDebugApi;

export interface NgtCannonDebugInfo {
  bodies: Body[];
  refs: { [uuid: string]: Body };
}

export interface NgtCannonDebugStoreState extends NgtCannonDebugInfo {
  color?: NgtColor;
  scale?: number;
  impl?: NgtCannonDebuggerInterface;
}
