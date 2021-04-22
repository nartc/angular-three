import type { Scene } from 'three';
import { RecursivePartial } from './common';
import type { Overwrite, ThreeCommonParameters } from './three';

export type SceneOptions = Overwrite<
  RecursivePartial<
    Omit<Scene, 'isScene' | 'onBeforeRender' | 'onAfterRender' | 'type'>
  >,
  ThreeCommonParameters
>;
