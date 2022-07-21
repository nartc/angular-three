import {
  BooleanInput,
  coerceBooleanProperty,
  provideCommonCameraRef,
  startWithUndefined,
  tapEffect,
} from '@angular-three/core';
import { NgtPerspectiveCamera } from '@angular-three/core/cameras';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-soba-perspective-camera',
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonCameraRef(NgtSobaPerspectiveCamera)],
})
export class NgtSobaPerspectiveCamera extends NgtPerspectiveCamera {
  @Input() set makeDefault(makeDefault: BooleanInput) {
    this.set({ makeDefault: coerceBooleanProperty(makeDefault) });
  }

  @Input() set manual(manual: BooleanInput) {
    this.set({ manual: coerceBooleanProperty(manual) });
  }

  protected override get setOptionsTrigger$() {
    return this.select(
      this.select((s) => s['manual']).pipe(startWithUndefined()),
      this.store.select((s) => s.size)
    );
  }

  protected override postSetOptions(camera: THREE.PerspectiveCamera) {
    const manual = this.get((s) => s['manual']);
    const size = this.store.get((s) => s.size);
    if (!manual) {
      camera.aspect = size.width / size.height;
      camera.updateProjectionMatrix();
    }
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.onCanvasReady(this.store.ready$, () => {
        this.setDefaultCamera(
          this.select(
            this.instance$,
            this.select((s) => s['makeDefault'])
          )
        );
      });
    });
  }

  private readonly setDefaultCamera = this.effect<{}>(
    tapEffect(() => {
      const camera = this.store.get((s) => s.camera);
      const cameraRef = this.store.get((s) => s.cameraRef);
      const makeDefault = this.get((s) => s['makeDefault']);

      if (this.instance.value && makeDefault) {
        const oldCamera = camera;
        this.store.set({ camera: this.instance.value });
        cameraRef.set(this.instance.value);

        return () => {
          this.store.set({ camera: oldCamera });
          cameraRef.set(oldCamera);
        };
      }

      return;
    })
  );
}

@NgModule({
  declarations: [NgtSobaPerspectiveCamera],
  exports: [NgtSobaPerspectiveCamera],
})
export class NgtSobaPerspectiveCameraModule {}
