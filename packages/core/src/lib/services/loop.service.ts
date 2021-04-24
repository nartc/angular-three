import { Injectable, OnDestroy } from '@angular/core';
import { Clock } from 'three';
import { AnimationStore, CanvasStore } from '../stores';

@Injectable()
export class LoopService implements OnDestroy {
  private readonly loopClock = new Clock();

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
    const {
      renderer,
      scene,
      camera,
      internal,
      clock,
    } = this.canvasStore.getImperativeState();
    const {
      animationCallbacks,
      hasPriority,
    } = this.animationStore.getImperativeState();

    if (renderer && scene && camera) {
      if (hasPriority) {
        animationCallbacks.sort(
          ({ priority: a = 0 }, { priority: b = 0 }) => a - b
        );
      } else {
        renderer.render(scene, camera);
      }

      for (const animationCallback of animationCallbacks) {
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
