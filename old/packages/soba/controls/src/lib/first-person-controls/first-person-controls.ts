import {
  NgtAnimationFrameStore,
  NgtCanvasStore,
  NgtStore,
  zonelessRequestAnimationFrame,
} from '@angular-three/core';
import { Directive, NgModule, OnInit, Output } from '@angular/core';
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
  extends NgtStore<NgtSobaFirstPersonControlsState>
  implements OnInit
{
  @Output() ready = this.select('controls');

  constructor(
    private canvasStore: NgtCanvasStore,
    private animationFrameStore: NgtAnimationFrameStore
  ) {
    super();
  }

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      this.hold(
        this.canvasStore.select(selectSlice(['camera', 'renderer'])),
        ({ renderer, camera }) => {
          if (camera && renderer) {
            this.set({
              controls: new FirstPersonControls(camera, renderer.domElement),
            });
          }
        }
      );

      this.effect(this.select('controls'), (controls) => {
        const animationUuid = this.animationFrameStore.register({
          callback: ({ delta }) => {
            controls.update(delta);
          },
        });

        return () => {
          this.animationFrameStore.actions.unregister(animationUuid);
        };
      });
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
