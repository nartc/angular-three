import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NgtAnimationFrameStoreState, NgtAnimationRecord } from '../models';
import { makeId } from '../utils/make-id';
import { EnhancedRxState } from './enhanced-component-store';

@Injectable()
export class NgtAnimationFrameStore extends EnhancedRxState<NgtAnimationFrameStoreState> {
  #init$ = new Subject();
  init = this.#init$.next.bind(this.#init$);

  #animationRecord$ = new Subject<NgtAnimationRecord & { uuid: string }>();

  register(animationRecord: NgtAnimationRecord) {
    const uuid = animationRecord.obj?.uuid || makeId();
    this.#animationRecord$.next({ ...animationRecord, uuid });
    return uuid;
  }

  #subscriberUuid$ = new Subject<string>();
  unregister = this.#subscriberUuid$.next.bind(this.#subscriberUuid$);

  constructor() {
    super();
    this.set({ animations: {}, subscribers: [], hasPriority: false });

    this.hold(this.select('animations'), (animations) => {
      const subscribers = Object.values(animations);
      subscribers.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      const hasPriority = subscribers.some(({ priority }) => !!priority);
      this.set({ hasPriority, subscribers });
    });
    this.hold(this.#animationRecord$, this.#register.bind(this));
    this.hold(this.#subscriberUuid$, this.#unregister.bind(this));
  }

  #register({
    uuid,
    ...animationRecord
  }: NgtAnimationRecord & { uuid: string }) {
    this.set((state) => {
      return {
        animations: { ...state.animations, [uuid]: animationRecord },
      };
    });

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
