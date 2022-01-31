import { Injectable } from '@angular/core';
import * as THREE from 'three';
import type { NgtAnimationFrameState, NgtAnimationRecord } from '../types';
import { makeId } from '../utils/make';
import { NgtStore } from './store';

type NgtAnimationRecordWithUuid = NgtAnimationRecord & { uuid: string };

@Injectable()
export class NgtAnimationFrameStore extends NgtStore<NgtAnimationFrameState> {
  readonly actions = this.createActions<{
    register: NgtAnimationRecordWithUuid;
    unregister: string;
  }>();

  constructor() {
    super();
    this.set({
      animations: new Map<string, NgtAnimationRecord>(),
      subscribers: [],
      hasPriority: false,
    });
  }

  init() {
    this.hold(this.select('animations'), (animations) => {
      if (!animations.size) return;
      const subscribers = Array.from(animations.values());
      subscribers.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      const hasPriority = subscribers.some(({ priority }) => !!priority);
      this.set({ hasPriority, subscribers });
    });

    this.effect(this.actions.register$, this.registerAnimation);
    this.effect(this.actions.unregister$, this.unregisterAnimation);
  }

  register(animation: NgtAnimationRecord) {
    const uuid =
      animation.obj instanceof THREE.Object3D ? animation.obj.uuid : makeId();
    this.actions.register({ ...animation, uuid });
    return uuid;
  }

  private registerAnimation = ({
    uuid,
    ...animationRecord
  }: NgtAnimationRecordWithUuid) => {
    if (uuid) {
      this.set((state) => ({
        animations: new Map<string, NgtAnimationRecord>(state.animations).set(
          uuid,
          animationRecord
        ),
      }));
    }

    return (
      prevRecord: NgtAnimationRecordWithUuid | undefined,
      isUnsubscribed: boolean
    ) => {
      if ((prevRecord && prevRecord.uuid !== uuid) || isUnsubscribed) {
        this.unregisterAnimation(uuid);
      }
    };
  };

  private unregisterAnimation = (uuid: string) => {
    if (!uuid) return;
    const currentAnimations = this.get('animations');
    const deleted = currentAnimations.delete(uuid);
    if (deleted) {
      this.set({ animations: currentAnimations });
    }
  };
}
