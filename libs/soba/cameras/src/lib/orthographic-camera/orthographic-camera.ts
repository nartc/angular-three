import {
  BooleanInput,
  coerceBooleanProperty,
  NgtPreObjectInit,
  provideCommonCameraRef,
  startWithUndefined,
  tapEffect,
} from '@angular-three/core';
import { NgtOrthographicCamera } from '@angular-three/core/cameras';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-soba-orthographic-camera',
  standalone: true,
  template: `<ng-content></ng-content>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonCameraRef(NgtSobaOrthographicCamera)],
})
export class NgtSobaOrthographicCamera extends NgtOrthographicCamera {
  @Input() set makeDefault(makeDefault: BooleanInput) {
    this.set({ makeDefault: coerceBooleanProperty(makeDefault) });
  }

  @Input() set manual(manual: BooleanInput) {
    this.set({ manual: coerceBooleanProperty(manual) });
  }

  protected override get preObjectInit(): NgtPreObjectInit {
    return (initFn) => {
      const size = this.store.get((s) => s.size);
      this.set((state) => ({
        left: size.width / -2,
        right: size.width / 2,
        top: size.height / 2,
        bottom: size.height / -2,
        near: state['near'],
        far: state['far'],
      }));

      initFn();
    };
  }

  protected override get setOptionsTrigger$() {
    return this.select((s) => s['manual']).pipe(startWithUndefined());
  }

  protected override postSetOptions(camera: THREE.OrthographicCamera) {
    const manual = this.get((s) => s['manual']);
    if (!manual) {
      camera.updateProjectionMatrix();
    }
  }

  override ngOnInit() {
    super.ngOnInit();
    this.zone.runOutsideAngular(() => {
      this.store.onReady(() => {
        this.setDefaultCamera(
          this.select(
            this.instance$,
            this.select((s) => s['makeDefault'])
          )
        );
      });
    });
  }

  private readonly setDefaultCamera = this.effect(
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
  imports: [NgtSobaOrthographicCamera],
  exports: [NgtSobaOrthographicCamera],
})
export class NgtSobaOrthographicCameraModule {}
