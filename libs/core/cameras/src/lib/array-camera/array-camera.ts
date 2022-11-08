// GENERATED
import {
  AnyConstructor,
  NgtCommonCamera,
  provideNgtCommonCamera,
  provideCommonCameraRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-array-camera',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonCamera(NgtArrayCamera),
    provideCommonCameraRef(NgtArrayCamera),
  ],
})
export class NgtArrayCamera extends NgtCommonCamera<THREE.ArrayCamera> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.ArrayCamera>
    | undefined;

  @Input() set cameras(cameras: THREE.PerspectiveCamera[]) {
    this.set({ cameras });
  }

  override get cameraType(): AnyConstructor<THREE.ArrayCamera> {
    return THREE.ArrayCamera;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      cameras: true,
    };
  }
}
