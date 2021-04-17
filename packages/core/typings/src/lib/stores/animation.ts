import type { Subscription } from 'rxjs';
import type { Object3D } from 'three';
import type { RenderState } from '../render';

export type AnimationCallback<TObject = null> = TObject extends null
  ? (state: RenderState) => void
  : (obj: TObject, state: RenderState) => void;

export interface AnimationRecord {
  obj: Object3D;
  callback: AnimationCallback<Object3D>;
  priority?: number;
}

export interface AnimationRecordNoObject {
  obj: null;
  callback: AnimationCallback;
  priority?: number;
}

export interface AnimationStoreState {
  animations: Record<string, AnimationRecord | AnimationRecordNoObject>;
  objectSubscriptions: Array<[string | null, Subscription]>;
}
