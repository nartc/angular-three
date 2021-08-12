import { Injectable, OnDestroy } from '@angular/core';
import { Clock } from 'three';
import { AnimationStore, CanvasStore } from '../stores';

@Injectable()
export class LoopService implements OnDestroy {
  private readonly loopClock = new Clock();
  // TODO: rethink limit 60fps
  // private readonly interval = 1 / 60; // 60fps;
  // private internalDelta = 0;

  constructor(
    private readonly canvasStore: CanvasStore,
    private readonly animationStore: AnimationStore
  ) {}

  start() {
    const { renderer } = this.canvasStore.getImperativeState();
    if (renderer) {
      renderer.setAnimationLoop(() => {
        this.tick(this.loopClock.getDelta());
      });
    }
  }

  stop() {
    const { renderer } = this.canvasStore.getImperativeState();
    if (renderer) {
      renderer.setAnimationLoop(null);
    }
  }

  private tick(delta: number) {
    // this.internalDelta += delta;
    //
    // if (this.internalDelta >= this.interval) {
    //   const {
    //     renderer,
    //     scene,
    //     camera,
    //     internal: { size, viewport },
    //     clock,
    //     mouse,
    //   } = this.canvasStore.getImperativeState();
    //   const { animationCallbacks, hasPriority } =
    //     this.animationStore.getImperativeState();
    //
    //   if (renderer && scene && camera) {
    //     if (hasPriority) {
    //       animationCallbacks.sort(
    //         ({ priority: a = 0 }, { priority: b = 0 }) => a - b
    //       );
    //     } else {
    //       renderer.render(scene, camera);
    //     }
    //
    //     const renderState = {
    //       clock,
    //       camera,
    //       scene,
    //       renderer,
    //       mouse,
    //       size,
    //       viewport,
    //       delta,
    //     };
    //     for (const animationCallback of animationCallbacks) {
    //       if (animationCallback.obj) {
    //         animationCallback.callback(animationCallback.obj, renderState);
    //       } else {
    //         animationCallback.callback(renderState);
    //       }
    //     }
    //   }
    //
    //   this.internalDelta = this.internalDelta % this.interval;
    // }
    const {
      renderer,
      scene,
      camera,
      internal: { size, viewport },
      clock,
      mouse,
    } = this.canvasStore.getImperativeState();
    const { animationCallbacks, hasPriority } =
      this.animationStore.getImperativeState();

    if (renderer && scene && camera) {
      if (hasPriority) {
        animationCallbacks.sort(
          ({ priority: a = 0 }, { priority: b = 0 }) => a - b
        );
      } else {
        renderer.render(scene, camera);
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
      for (const animationCallback of animationCallbacks) {
        if (animationCallback.obj) {
          animationCallback.callback(animationCallback.obj, renderState);
        } else {
          animationCallback.callback(renderState);
        }
      }
    }
  }

  ngOnDestroy() {
    this.stop();
  }
}
