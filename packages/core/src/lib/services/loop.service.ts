import { Injectable, NgZone } from '@angular/core';
import { requestAnimationFrame } from '@rx-angular/cdk/zone-less';
import { NgtAnimationFrameStore } from '../stores/animation-frame.store';
import { NgtStore } from '../stores/store';
import { NgtAnimationFrameStoreState, NgtRender, NgtState } from '../types';

@Injectable()
export class NgtLoopService {
  #running = false;
  #repeat?: number;
  #frames = 1;

  constructor(
    private store: NgtStore,
    private animationFrameStore: NgtAnimationFrameStore,
    private ngZone: NgZone
  ) {}

  render(
    timestamp: number,
    state: NgtState,
    animationFrameState: NgtAnimationFrameStoreState
  ): number {
    return this.ngZone.runOutsideAngular(() => {
      const {
        clock,
        frameloop,
        camera,
        scene,
        renderer,
        mouse,
        size,
        viewport,
      } = state;
      const { subscribers, hasPriority } = animationFrameState;

      if (renderer) {
        let delta = clock.getDelta();
        // In frameloop='never' mode, clock times are updated using the provided timestamp
        if (frameloop === 'never' && typeof timestamp === 'number') {
          delta = timestamp - clock.elapsedTime;
          clock.oldTime = clock.elapsedTime;
          clock.elapsedTime = timestamp;
        }

        const renderState = {
          clock,
          camera,
          scene,
          renderer,
          mouse,
          size,
          viewport,
          delta,
        };

        for (const subscriber of subscribers) {
          subscriber.callback(renderState as NgtRender, subscriber.obj);
        }

        if (!hasPriority) {
          renderer.render(scene!, camera!);
        }
      }

      this.#frames = Math.max(0, this.#frames - 1);
      return state.frameloop === 'always' ? 1 : this.#frames;
    });
  }

  loop(timestamp: number): number | undefined {
    return this.ngZone.runOutsideAngular(() => {
      this.#running = true;
      this.#repeat = 0;

      const state = this.store.get();
      if (state.ready && (state.frameloop === 'always' || this.#frames > 0)) {
        this.#repeat += this.render(
          timestamp,
          state,
          this.animationFrameStore.get()
        );
      }

      if (this.#repeat > 0) return requestAnimationFrame(this.loop.bind(this));

      this.#running = false;
      return;
    });
  }

  invalidate(state: NgtState = this.store.get()) {
    if (state.vr) {
      state.renderer?.setAnimationLoop((timestamp) => {
        this.render(
          timestamp,
          this.store.get(),
          this.animationFrameStore.get()
        );
      });
      return;
    }

    if (!state.ready || state.frameloop === 'never') return;

    // Increase frames, do not go higher than 60
    this.#frames = Math.min(60, this.#frames + 1);
    // If the render-loop isn't active, start it
    if (!this.#running) {
      this.#running = true;
      requestAnimationFrame(this.loop.bind(this));
    }
  }
}
