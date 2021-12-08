import {
  EnhancedComponentStore,
  NgtAnimationFrameStore,
  NgtLoopService,
  NgtStore,
  tapEffect,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  NgModule,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription, tap, withLatestFrom } from 'rxjs';
import * as THREE from 'three';
import { FlyControls } from 'three-stdlib';

interface NgtSobaFlyControlsState {
  controls?: FlyControls;
}

@Directive({
  selector: 'ngt-soba-fly-controls',
  exportAs: 'ngtSobaFlyControls',
})
export class NgtSobaFlyControls
  extends EnhancedComponentStore<NgtSobaFlyControlsState>
  implements OnInit
{
  @Output() change = new EventEmitter<THREE.Event>();

  constructor(
    private store: NgtStore,
    private ngZone: NgZone,
    private loopService: NgtLoopService,
    private animationFrameStore: NgtAnimationFrameStore
  ) {
    super({ controls: undefined });
  }

  ngOnInit() {
    this.#initControls();
    this.#initControlsEvents(this.selectors.controls$);
    this.#registerAnimation(this.selectors.controls$);
  }

  #initControls = this.effect(($) =>
    $.pipe(
      withLatestFrom(
        this.store.selectors.camera$,
        this.store.selectors.renderer$
      ),
      tap(([, camera, renderer]) => {
        this.ngZone.runOutsideAngular(() => {
          if (camera && renderer) {
            const controls = new FlyControls(camera, renderer.domElement);
            this.patchState({ controls });
          }
        });
      })
    )
  );

  #initControlsEvents = this.effect<FlyControls | undefined>((controls$) =>
    controls$.pipe(
      tapEffect((controls) => {
        const callback = (e: THREE.Event) => {
          this.loopService.invalidate(this.store.getImperativeState());
          if (this.change.observed) {
            this.change.emit(e);
          }
        };

        if (controls) {
          controls.addEventListener('change', callback);
        }

        return () => {
          if (controls) {
            controls.removeEventListener('change', callback);
          }
        };
      })
    )
  );

  #registerAnimation = this.effect<FlyControls | undefined>((controls$) =>
    controls$.pipe(
      tapEffect((controls) => {
        let animationSubscription: Subscription;
        if (controls) {
          animationSubscription = this.animationFrameStore.register({
            obj: null,
            callback: ({ delta }) => {
              controls.update(delta);
            },
          });
        }

        return () => {
          if (animationSubscription) {
            animationSubscription.unsubscribe();
          }
        };
      })
    )
  );

  get controls() {
    return this.getImperativeState().controls as FlyControls;
  }
}

@NgModule({
  declarations: [NgtSobaFlyControls],
  exports: [NgtSobaFlyControls],
})
export class NgtSobaFlyControlsModule {}
