import * as THREE from 'three';
import type { NgtRender } from '../render';

export interface NgtAnimationReady<TObject = any> {
  animateObject: TObject;
  renderState: NgtRender;
}

export type NgtAnimationCallback<TObject> = (
  state: NgtRender,
  obj: TObject
) => void;

export interface NgtAnimationRecord {
  obj: THREE.Object3D | null;
  callback: NgtAnimationCallback<THREE.Object3D | null>;
  priority?: number;
}

export interface NgtAnimationFrameStoreState {
  animations: Record<string, NgtAnimationRecord>;
  subscribers: Array<NgtAnimationRecord>;
  hasPriority: boolean;
}
