// GENERATED
import { AnyConstructor, NgtCommonCamera, provideCommonCameraRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-array-camera',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonCameraRef(NgtArrayCamera)],
})
export class NgtArrayCamera extends NgtCommonCamera<THREE.ArrayCamera> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.ArrayCamera> | undefined;

  @Input() set cameras(cameras: THREE.PerspectiveCamera[]) {
    this.set({ cameras });
  }

  override get cameraType(): AnyConstructor<THREE.ArrayCamera> {
    return THREE.ArrayCamera;
  }

  protected override get optionFields(): Record<string, boolean> {
    return {
      ...super.optionFields,
      cameras: true,
    };
  }
}

@NgModule({
  imports: [NgtArrayCamera],
  exports: [NgtArrayCamera],
})
export class NgtArrayCameraModule {}
