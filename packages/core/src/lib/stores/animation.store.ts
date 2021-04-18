import { Injectable } from '@angular/core';
import { isObservable, Observable } from 'rxjs';
import { filter, tap, withLatestFrom } from 'rxjs/operators';
import type { Object3D } from 'three';
import type {
  AnimationCallback,
  AnimationStoreState,
  RenderState,
} from '../typings';
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
    callback: AnimationCallback<TObject3d>,
    priority?: number
  ): void;
  registerAnimation<TObject3d extends Object3D = Object3D>(
    obs: Observable<TObject3d | null>,
    callback: AnimationCallback<TObject3d>,
    priority?: number
  ): void;
  registerAnimation(callback: AnimationCallback, priority?: number): void;
  registerAnimation<TObject3d extends Object3D = Object3D>(
    objOrObsOrCallback: TObject3d | Observable<TObject3d> | AnimationCallback,
    callbackOrPriority?:
      | ((obj: TObject3d, state: RenderState) => void)
      | number,
    priority = 0
  ) {
    if (objOrObsOrCallback === undefined) return;

    if (typeof objOrObsOrCallback === 'function') {
      this.patchState((state) => ({
        ...state,
        animations: {
          ...state.animations,
          [makeId()]: {
            obj: null,
            callback: objOrObsOrCallback,
            priority: (callbackOrPriority as number) || 0,
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
                  callback: callbackOrPriority as AnimationCallback<TObject3d>,
                  priority,
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
          callback: callbackOrPriority as AnimationCallback<TObject3d>,
          priority,
        },
      },
    }));
  }

  ngOnDestroy() {
    this.clearEffect();
    super.ngOnDestroy();
  }
}
