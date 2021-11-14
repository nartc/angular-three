import type { Subscription } from 'rxjs';
import * as THREE from 'three';
import type { NgtRender } from './render';

export interface NgtAnimationReady<TObject = any> {
  animateObject: TObject;
  renderState: NgtRender;
}

export type NgtAnimationCallback<TObject = null> = TObject extends null
  ? (state: NgtRender) => void
  : (obj: TObject, state: NgtRender) => void;

export interface NgtAnimationRecord {
  obj: THREE.Object3D;
  callback: NgtAnimationCallback<THREE.Object3D>;
  priority?: number;
}

export interface NgtAnimationRecordNoObject {
  obj: null;
  callback: NgtAnimationCallback;
  priority?: number;
}

export interface AnimationStoreState {
  animations: Record<string, NgtAnimationRecord | NgtAnimationRecordNoObject>;
  animationCallbacks: Array<NgtAnimationRecord | NgtAnimationRecordNoObject>;
  hasPriority: boolean;
  objectSubscriptions: Array<[string | null, Subscription]>;
}
