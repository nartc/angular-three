import {
  Directive,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';
import { Object3D } from 'three';
import { AnimationStore } from '../stores';
import type { AnimationReady } from '../typings';

@Directive()
export abstract class AnimationLoopParticipant<TObject = unknown>
  implements OnDestroy {
  @Output() animateReady = new EventEmitter<AnimationReady<TObject>>();

  private animateTeardown?: () => void;

  protected constructor(
    protected readonly animationStore: AnimationStore,
    protected readonly ngZone: NgZone
  ) {}

  protected participate(animateObject: TObject) {
    this.ngZone.runOutsideAngular(() => {
      if (this.animateReady.observers.length) {
        if (animateObject instanceof Object3D) {
          this.animateTeardown = this.animationStore.registerAnimation(
            animateObject as Object3D,
            (obj, state) => {
              this.animateReady.emit({
                animateObject: (obj as unknown) as TObject,
                renderState: state,
              });
            }
          );
        } else {
          this.animateTeardown = this.animationStore.registerAnimation(
            (state) => {
              this.animateReady.emit({
                animateObject,
                renderState: state,
              });
            }
          );
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.animateTeardown) {
      this.animateTeardown();
    }
  }
}
