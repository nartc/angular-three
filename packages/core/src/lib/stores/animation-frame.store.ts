import { Injectable } from '@angular/core';
import { noop } from 'rxjs';
import { NgtAnimationFrameStoreState, NgtAnimationRecord } from '../types';
import { makeId } from '../utils/make-id';
import { EnhancedRxState } from './enhanced-rx-state';

@Injectable()
export class NgtAnimationFrameStore extends EnhancedRxState<
  NgtAnimationFrameStoreState,
  {
    animationRecord: NgtAnimationRecord & { uuid: string };
    unsubscriberUuid: string;
  }
> {
  actions = this.create();

  register(animationRecord: NgtAnimationRecord) {
    const uuid = animationRecord.obj?.uuid || makeId();
    this.actions.animationRecord({ ...animationRecord, uuid });
    return uuid;
  }

  constructor() {
    super();
    this.set({ animations: {}, subscribers: [], hasPriority: false });

    this.hold(this.select('animations'), (animations) => {
      const subscribers = Object.values(animations);
      subscribers.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      const hasPriority = subscribers.some(({ priority }) => !!priority);
      this.set({ hasPriority, subscribers });
    });
    this.hold(this.actions.animationRecord$, this.#register.bind(this));
    this.hold(this.actions.unsubscriberUuid$, this.#unregister.bind(this));
  }

  #register(
    { uuid, ...animationRecord }: NgtAnimationRecord & { uuid: string } = {
      uuid: '',
      callback: noop,
    }
  ) {
    if (uuid) {
      this.set((state) => {
        return {
          animations: { ...state.animations, [uuid]: animationRecord },
        };
      });
    }

    return (
      prevRecord: (NgtAnimationRecord & { uuid: string }) | undefined,
      isUnsub: boolean
    ) => {
      if ((prevRecord && prevRecord.uuid !== uuid) || isUnsub) {
        this.#unregister(uuid);
      }
    };
  }

  #unregister(uuid: string) {
    if (!uuid) return;
    this.set((state) => {
      const { [uuid]: _, ...animations } = state.animations;
      return { animations };
    });
  }

  ngOnDestroy() {
    this.set({ animations: {} });
    super.ngOnDestroy();
  }
}
