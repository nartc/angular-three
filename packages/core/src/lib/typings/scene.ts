import type { Scene } from 'three';
import type { Overwrite, ThreeCommonParameters } from './three';

export type SceneOptions = Overwrite<
  Partial<Omit<Scene, 'isScene' | 'onBeforeRender' | 'onAfterRender' | 'type'>>,
  ThreeCommonParameters
>;
