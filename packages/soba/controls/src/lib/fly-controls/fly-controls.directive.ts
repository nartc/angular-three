import {
  EnhancedRxState,
  NgtAnimationFrameStore,
  NgtLoopService,
  NgtStore,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  NgModule,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { selectSlice } from '@rx-angular/state';
import * as THREE from 'three';
import { FlyControls } from 'three-stdlib';

interface NgtSobaFlyControlsState {
  controls: FlyControls;
}

@Directive({
  selector: 'ngt-soba-fly-controls',
  exportAs: 'ngtSobaFlyControls',
})
export class NgtSobaFlyControls
  extends EnhancedRxState<NgtSobaFlyControlsState>
  implements OnInit
{
  @Output() ready = this.select('controls');
  @Output() change = new EventEmitter<THREE.Event>();

  constructor(
    private store: NgtStore,
    private loopService: NgtLoopService,
    private animationFrameStore: NgtAnimationFrameStore,
    private ngZone: NgZone
  ) {
    super();
  }

  ngOnInit() {
    this.holdEffect(this.select('controls'), (controls) => {
      const callback = (e: THREE.Event) => {
        this.loopService.invalidate();
        if (this.change.observed) {
          this.change.emit(e);
        }
      };

      controls.addEventListener('change', callback);

      return () => {
        controls.removeEventListener('change', callback);
      };
    });

    this.hold(
      this.store.select(selectSlice(['camera', 'renderer'])),
      ({ renderer, camera }) => {
        this.ngZone.runOutsideAngular(() => {
          if (camera && renderer) {
            this.set({
              controls: new FlyControls(camera, renderer.domElement),
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
        this.animationFrameStore.unregister(animationUuid);
      };
    });
  }

  get controls() {
    return this.get('controls') as FlyControls;
  }
}

@NgModule({
  declarations: [NgtSobaFlyControls],
  exports: [NgtSobaFlyControls],
})
export class NgtSobaFlyControlsModule {}
