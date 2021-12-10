import * as THREE from 'three';
import type { NgtRender } from '../render';

export type NgtAnimationCallback<TObject> = (
  state: NgtRender,
  obj: TObject
) => void;

export interface NgtAnimationRecord {
  obj?: THREE.Object3D;
  callback: NgtAnimationCallback<THREE.Object3D | undefined>;
  priority?: number;
}

export interface NgtAnimationFrameStoreState {
  animations: Record<string, NgtAnimationRecord>;
  subscribers: Array<NgtAnimationRecord>;
  hasPriority: boolean;
}
