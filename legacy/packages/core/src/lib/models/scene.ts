import * as THREE from 'packages/core/src/lib/models/three';
import type { NgtCommonParameters, Overwrite } from './three';

export type NgtSceneOptions = Overwrite<
  Partial<
    Omit<THREE.Scene, 'isScene' | 'onBeforeRender' | 'onAfterRender' | 'type'>
  >,
  NgtCommonParameters
>;
