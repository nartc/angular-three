import { Injectable, NgZone } from '@angular/core';
import { tap } from 'rxjs';
import { NgtAnimationFrameStoreState, NgtAnimationRecord } from '../models';
import { makeId } from '../utils/make-id';
import { EnhancedComponentStore, tapEffect } from './enhanced-component-store';

@Injectable()
export class NgtAnimationFrameStore extends EnhancedComponentStore<NgtAnimationFrameStoreState> {
  constructor(private ngZone: NgZone) {
    super({
      animations: {},
      subscribers: [],
      hasPriority: false,
    });
  }

  readonly init = this.effect(($) =>
    $.pipe(
      tapEffect(() => {
        this.ngZone.runOutsideAngular(() => {
          this.#updateSubscribers(this.selectors.animations$);
        });

        return () => {
          this.ngZone.runOutsideAngular(() => {
            this.patchState({ animations: {} });
          });
        };
      })
    )
  );

  readonly register = this.effect<NgtAnimationRecord>((animation$) =>
    animation$.pipe(
      tapEffect((animation) => {
        const uuid = animation.obj?.uuid || makeId();
        this.ngZone.runOutsideAngular(() => {
          this.patchState((state) => ({
            animations: { ...state.animations, [uuid]: animation },
          }));
        });

        return (prevAnimation, isUnsub) => {
          if (
            (prevAnimation && prevAnimation.obj !== animation.obj) ||
            isUnsub
          ) {
            this.#unregister(uuid);
          }
        };
      })
    )
  );

  #unregister = this.effect<string>((uuid$) =>
    uuid$.pipe(
      tap((uuid) => {
        this.ngZone.runOutsideAngular(() => {
          this.patchState((state) => {
            const { [uuid]: _, ...animations } = state.animations;
            return { animations };
          });
        });
      })
    )
  );

  #updateSubscribers = this.effect<NgtAnimationFrameStoreState['animations']>(
    (animations$) =>
      animations$.pipe(
        tap((animations) => {
          this.ngZone.runOutsideAngular(() => {
            const subscribers = Object.values(animations);
            subscribers.sort((a, b) => (a.priority || 0) - (b.priority || 0));
            const hasPriority = subscribers.some(({ priority }) => !!priority);
            this.patchState({ subscribers, hasPriority });
          });
        })
      )
  );
}
