import { Injectable, OnDestroy } from '@angular/core';
import {
  filter,
  isObservable,
  Observable,
  skip,
  tap,
  withLatestFrom,
} from 'rxjs';
import * as THREE from 'three';
import type {
  AnimationStoreState,
  NgtAnimationCallback,
  NgtRender,
} from '../models';
import { makeId } from '../utils/make-id.util';
import { EnhancedComponentStore } from './enhanced-component-store.abstract';

@Injectable()
export class AnimationStore
  extends EnhancedComponentStore<AnimationStoreState>
  implements OnDestroy
{
  constructor() {
    super({
      animations: {},
      objectSubscriptions: [],
      animationCallbacks: [],
      hasPriority: false,
    });
    this.animationsChangedEffect(this.selectors.animations$.pipe(skip(1)));
  }

  readonly animationsChangedEffect = this.effect<
    AnimationStoreState['animations']
  >((animations$) =>
    animations$.pipe(
      tap((animations) => {
        const animationCallbacks = Object.values(animations);
        const hasPriority = animationCallbacks.some(
          ({ priority }) => !!priority
        );
        this.patchState({ animationCallbacks, hasPriority });
      })
    )
  );

  readonly unregisterAnimationEffect = this.effect<string>((uuid$) =>
    uuid$.pipe(
      withLatestFrom(
        this.selectors.animations$,
        this.selectors.objectSubscriptions$
      ),
      tap(
        ([uuid, animations, objectSubscriptions]: [
          string,
          AnimationStoreState['animations'],
          AnimationStoreState['objectSubscriptions']
        ]) => {
          const subscription = objectSubscriptions.find(
            ([objectUuid]) => objectUuid === uuid
          );
          if (subscription) {
            subscription[1].unsubscribe();
          }

          const { [uuid]: _, ...updatedAnimations } = animations;
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

  registerAnimation<TObject3d extends THREE.Object3D = THREE.Object3D>(
    obj: TObject3d,
    callback: NgtAnimationCallback<TObject3d>,
    priority?: number
  ): () => void;
  registerAnimation<TObject3d extends THREE.Object3D = THREE.Object3D>(
    obs: Observable<TObject3d | null>,
    callback: NgtAnimationCallback<TObject3d>,
    priority?: number
  ): () => void;
  registerAnimation(
    callback: NgtAnimationCallback,
    priority?: number
  ): () => void;
  registerAnimation<TObject3d extends THREE.Object3D = THREE.Object3D>(
    objOrObsOrCallback:
      | TObject3d
      | Observable<TObject3d>
      | NgtAnimationCallback,
    callbackOrPriority?: ((obj: TObject3d, state: NgtRender) => void) | number,
    priority = 0
  ) {
    if (objOrObsOrCallback === undefined) return;
    if (typeof objOrObsOrCallback === 'function') {
      const id = makeId();
      this.patchState((state) => ({
        ...state,
        animations: {
          ...state.animations,
          [id]: {
            obj: null,
            callback: objOrObsOrCallback,
            priority: (callbackOrPriority as number) || 0,
          },
        },
      }));
      return () => {
        this.unregisterAnimationEffect(id);
      };
    }

    if (isObservable(objOrObsOrCallback)) {
      let id = '';
      const subscription = objOrObsOrCallback
        .pipe(filter((obj) => !!obj))
        .subscribe((obj) => {
          this.patchState((state) => {
            const objectSubscriptions = state.objectSubscriptions;
            if (objectSubscriptions[objectSubscriptions.length - 1]?.[0]) {
              objectSubscriptions[objectSubscriptions.length - 1][0] = obj.uuid;
            }
            id = obj.uuid;
            return {
              animations: {
                ...state.animations,
                [id]: {
                  obj,
                  callback:
                    callbackOrPriority as NgtAnimationCallback<TObject3d>,
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
      return () => {
        this.unregisterAnimationEffect(id);
      };
    }

    const uuid = (objOrObsOrCallback as THREE.Object3D).uuid;
    this.patchState((state) => ({
      animations: {
        ...state.animations,
        [uuid]: {
          obj: objOrObsOrCallback,
          callback: callbackOrPriority as NgtAnimationCallback<TObject3d>,
          priority,
        },
      },
    }));
    return () => {
      this.unregisterAnimationEffect(uuid);
    };
  }

  ngOnDestroy() {
    this.clearEffect();
    super.ngOnDestroy();
  }
}
