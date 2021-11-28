import {
  Directive,
  EventEmitter,
  Input,
  NgModule,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import * as THREE from 'three';
import { NgtRender } from '../models';
import { NgtAnimationFrameStore } from '../stores/animation-frame.store';
import { Controller, createControllerProviderFactory } from './controller';

@Directive({
  selector: '[animateReady]',
  exportAs: 'ngtAnimationSubscriberController',
})
export class NgtAnimationSubscriberController
  extends Controller
  implements OnDestroy
{
  @Input() priority = 0;
  @Output() animateReady = new EventEmitter<NgtRender>();

  #animateSubscription?: Subscription;

  constructor(
    private animationFrameStore: NgtAnimationFrameStore,
    ngZone: NgZone
  ) {
    super(ngZone);
  }

  subscribe(obj: THREE.Object3D) {
    this.ngZone.runOutsideAngular(() => {
      // only subscribe to animation frame if there's an output handler
      if (this.animateReady.observed) {
        this.#animateSubscription = this.animationFrameStore.register({
          obj,
          callback: this.animateReady.emit.bind(this.animateReady),
          priority: this.priority,
        });
      }
    });
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.#animateSubscription) {
        this.#animateSubscription.unsubscribe();
      }
    });
  }

  get controller(): Controller | undefined {
    return undefined;
  }

  get props(): string[] {
    return [];
  }
}

@NgModule({
  declarations: [NgtAnimationSubscriberController],
  exports: [NgtAnimationSubscriberController],
})
export class NgtAnimationSubscriberControllerModule {}

export const [
  NGT_ANIMATION_SUBSCRIBER_WATCHED_CONTROLLER,
  NGT_ANIMATION_SUBSCRIBER_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
  watchedControllerTokenName: 'Watched AnimationSubscriberController',
  controller: NgtAnimationSubscriberController,
});
