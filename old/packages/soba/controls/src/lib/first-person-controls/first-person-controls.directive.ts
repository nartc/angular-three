import {
  EnhancedRxState,
  NgtAnimationFrameStore,
  NgtStore,
} from '@angular-three/core';
import { Directive, NgModule, NgZone, OnInit, Output } from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import { FirstPersonControls } from 'three-stdlib';

interface NgtSobaFirstPersonControlsState {
  controls: FirstPersonControls;
}

@Directive({
  selector: 'ngt-soba-first-person-controls',
  exportAs: 'ngtSobaFirstPersonControls',
})
export class NgtSobaFirstPersonControls
  extends EnhancedRxState<NgtSobaFirstPersonControlsState>
  implements OnInit
{
  @Output() ready = this.select('controls');

  constructor(
    private store: NgtStore,
    private animationFrameStore: NgtAnimationFrameStore,
    private ngZone: NgZone
  ) {
    super();
  }

  ngOnInit() {
    this.hold(
      this.store.select(selectSlice(['camera', 'renderer'])),
      ({ renderer, camera }) => {
        this.ngZone.runOutsideAngular(() => {
          if (camera && renderer) {
            this.set({
              controls: new FirstPersonControls(camera, renderer.domElement),
            });
          }
        });
      }
    );

    this.holdEffect(this.select('controls'), (controls) => {
      const animationUuid = this.animationFrameStore.register({
        callback: ({ delta }) => {
          controls.update(delta);
        },
      });

      return () => {
        this.animationFrameStore.actions.unsubscriberUuid(animationUuid);
      };
    });
  }

  get controls() {
    return this.get('controls') as FirstPersonControls;
  }
}

@NgModule({
  declarations: [NgtSobaFirstPersonControls],
  exports: [NgtSobaFirstPersonControls],
})
export class NgtSobaFirstPersonControlsModule {}
