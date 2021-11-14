import {
  Directive,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import type { NgtAnimationReady } from '../models';
import { AnimationStore } from '../stores/animation.store';

@Directive()
export abstract class NgtAnimationParticipant<TObject = unknown>
  implements OnDestroy
{
  @Output() animateReady = new EventEmitter<NgtAnimationReady<TObject>>();

  private animateTeardown?: () => void;

  protected constructor(
    protected animationStore: AnimationStore,
    protected ngZone: NgZone
  ) {}

  protected participate(animateObject: TObject) {
    this.ngZone.runOutsideAngular(() => {
      if (this.animateReady.observed) {
        if (animateObject instanceof THREE.Object3D) {
          this.animateTeardown = this.animationStore.registerAnimation(
            animateObject as THREE.Object3D,
            (obj, state) => {
              this.animateReady.emit({
                animateObject: obj as unknown as TObject,
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
    this.ngZone.runOutsideAngular(() => {
      if (this.animateTeardown) {
        this.animateTeardown();
      }
    });
  }
}
