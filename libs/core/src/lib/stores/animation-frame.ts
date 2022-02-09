import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import * as THREE from 'three';
import type { NgtAnimationFrameState, NgtAnimationRecord } from '../types';
import { makeId } from '../utils/make';
import { NgtStore, tapEffect } from './store';

type NgtAnimationRecordWithUuid = NgtAnimationRecord & { uuid: string };

@Injectable()
export class NgtAnimationFrameStore extends NgtStore<NgtAnimationFrameState> {
  constructor() {
    super();
    this.set({
      animations: new Map<string, NgtAnimationRecord>(),
      subscribers: [],
      hasPriority: false,
    });
  }

  init() {
    this.updateSubscribers(this.select((s) => s.animations));
  }

  register(animation: NgtAnimationRecord) {
    const uuid =
      animation.obj instanceof THREE.Object3D ? animation.obj.uuid : makeId();
    this.registerAnimation({ ...animation, uuid });
    return uuid;
  }

  unregister(uuid: string) {
    if (!uuid) return;
    const currentAnimations = this.get((s) => s.animations);
    const deleted = currentAnimations.delete(uuid);
    if (deleted) {
      this.set({ animations: currentAnimations });
    }
  }

  private readonly registerAnimation = this.effect<NgtAnimationRecordWithUuid>(
    tapEffect(({ uuid, ...record }) => {
      if (uuid) {
        this.set((state) => ({
          animations: new Map<string, NgtAnimationRecord>(state.animations).set(
            uuid,
            record
          ),
        }));
      }

      return ({ prev: { uuid: prevUuid } = {}, complete }) => {
        if (prevUuid !== uuid || complete) {
          this.unregister(uuid);
        }
      };
    })
  );

  private readonly updateSubscribers = this.effect<
    NgtAnimationFrameState['animations']
  >(
    tap((animations) => {
      if (!animations.size) return;
      const subscribers = Array.from(animations.values());
      subscribers.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      this.set({
        hasPriority: subscribers.some(({ priority }) => !!priority),
        subscribers,
      });
    })
  );
}
