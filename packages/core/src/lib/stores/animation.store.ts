import type {
  AnimationCallback,
  AnimationStoreState,
  RenderState,
} from '@angular-three/core/typings';
import { Injectable } from '@angular/core';
import { isObservable, Observable } from 'rxjs';
import { filter, tap, withLatestFrom } from 'rxjs/operators';
import type { Object3D } from 'three';
import { makeId } from '../utils';
import { ImperativeComponentStore } from './imperative-component-store.abstract';

@Injectable()
export class AnimationStore extends ImperativeComponentStore<AnimationStoreState> {
  constructor() {
    super({ animations: {}, objectSubscriptions: [] });
  }

  readonly unregisterAnimationEffect = this.effect<string>((uuid$) =>
    uuid$.pipe(
      withLatestFrom(this.state$),
      tap(
        ([uuid, { animations, objectSubscriptions }]: [
          string,
          AnimationStoreState
        ]) => {
          const subscription = objectSubscriptions.find(
            ([objectUuid]) => objectUuid === uuid
          );
          if (subscription) {
            subscription[1].unsubscribe();
          }

          const { [uuid]: _removed, ...updatedAnimations } = animations;
          this.patchState({
            animations: updatedAnimations,
            objectSubscriptions: objectSubscriptions.filter(
              ([objectUuid]) => objectUuid !== uuid
            ),
          });
        }
      )
    )
  );

  readonly clearEffect = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.patchState((state) => {
          state.objectSubscriptions.forEach(([, subscription]) =>
            subscription.unsubscribe()
          );
          return { animations: {}, objectSubscriptions: [] };
        });
      })
    )
  );

  registerAnimation<TObject3d extends Object3D = Object3D>(
    obj: TObject3d,
    callback: AnimationCallback<TObject3d>
  ): void;
  registerAnimation<TObject3d extends Object3D = Object3D>(
    obs: Observable<TObject3d | null>,
    callback: AnimationCallback<TObject3d>
  ): void;
  registerAnimation(callback: AnimationCallback): void;
  registerAnimation<TObject3d extends Object3D = Object3D>(
    objOrObsOrCallback: TObject3d | Observable<TObject3d> | AnimationCallback,
    callback?: (obj: TObject3d, state: RenderState) => void
  ) {
    if (objOrObsOrCallback == null) return;

    if (typeof objOrObsOrCallback === 'function') {
      this.patchState((state) => ({
        ...state,
        animations: {
          ...state.animations,
          [makeId()]: {
            obj: null,
            callback: objOrObsOrCallback,
          },
        },
      }));
      return;
    }

    if (isObservable(objOrObsOrCallback)) {
      const subscription = objOrObsOrCallback
        .pipe(filter((obj) => !!obj))
        .subscribe((obj) => {
          this.patchState((state) => {
            const objectSubscriptions = state.objectSubscriptions;
            if (objectSubscriptions[objectSubscriptions.length - 1]?.[0]) {
              objectSubscriptions[objectSubscriptions.length - 1][0] = obj.uuid;
            }
            return {
              animations: {
                ...state.animations,
                [obj.uuid]: {
                  obj,
                  callback: callback as AnimationCallback<TObject3d>,
                },
              },
              objectSubscriptions,
            };
          });
        });
      this.patchState((state) => ({
        objectSubscriptions: [
          ...state.objectSubscriptions,
          [null, subscription],
        ],
      }));
      return;
    }

    this.patchState((state) => ({
      animations: {
        ...state.animations,
        [(objOrObsOrCallback as Object3D).uuid]: {
          obj: objOrObsOrCallback,
          callback: callback as AnimationCallback<TObject3d>,
        },
      },
    }));
  }

  ngOnDestroy() {
    this.clearEffect();
    super.ngOnDestroy();
  }
}
