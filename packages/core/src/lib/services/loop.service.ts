import { Injectable, OnDestroy } from '@angular/core';
import { AnimationStore, CanvasStore } from '../stores';

@Injectable()
export class LoopService implements OnDestroy {
  constructor(
    private readonly canvasStore: CanvasStore,
    private readonly animationStore: AnimationStore
  ) {}

  start() {
    const { renderer } = this.canvasStore.getImperativeState();
    if (renderer) {
      renderer.setAnimationLoop(() => {
        this.tick();
      });
    }
  }

  stop() {
    const { renderer } = this.canvasStore.getImperativeState();
    if (renderer) {
      renderer.setAnimationLoop(null);
    }
  }

  tick() {
    const {
      renderer,
      scene,
      camera,
      internal,
      clock,
    } = this.canvasStore.getImperativeState();
    const delta = clock.getDelta();
    const { animations } = this.animationStore.getImperativeState();

    if (renderer && scene && camera) {
      const animationsCallbacks = Object.values(animations);
      const hasPriority = animationsCallbacks.some(
        ({ priority }) => !!priority
      );

      if (hasPriority) {
        animationsCallbacks.sort(({ priority: a }, { priority: b }) => a! - b!);
      } else {
        renderer.render(scene, camera);
      }

      for (const animationCallback of animationsCallbacks) {
        if (animationCallback.obj) {
          animationCallback.callback(animationCallback.obj, {
            clock,
            camera,
            scene,
            renderer,
            size: internal.size,
            delta,
          });
        } else {
          animationCallback.callback({
            clock,
            camera,
            scene,
            renderer,
            size: internal.size,
            delta,
          });
        }
      }
    }
  }

  ngOnDestroy() {
    this.stop();
  }
}
