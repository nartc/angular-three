import {
  NgtAnimationFrameStore,
  NgtCanvasStore,
  NgtLoop,
  NgtStore,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import {
  Directive,
  EventEmitter,
  NgModule,
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
  extends NgtStore<NgtSobaFlyControlsState>
  implements OnInit
{
  @Output() ready = this.select('controls');
  @Output() change = new EventEmitter<THREE.Event>();

  constructor(
    private canvasStore: NgtCanvasStore,
    private loop: NgtLoop,
    private animationFrameStore: NgtAnimationFrameStore
  ) {
    super();
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      this.effect(this.select('controls'), (controls) => {
        const animationUuid = this.animationFrameStore.register({
          callback: ({ delta }) => {
            controls.update(delta);
          },
        });

        const callback = (e: THREE.Event) => {
          this.loop.invalidate();
          if (this.change.observed) {
            this.change.emit(e);
          }
        };

        controls.addEventListener('change', callback);

        return () => {
          controls.removeEventListener('change', callback);
          this.animationFrameStore.actions.unregister(animationUuid);
        };
      });

      this.hold(
        this.canvasStore.select(selectSlice(['camera', 'renderer'])),
        ({ renderer, camera }) => {
          if (camera && renderer) {
            this.set({
              controls: new FlyControls(camera, renderer.domElement),
            });
          }
        }
      );
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
