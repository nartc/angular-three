// GENERATED
import {
  AnyConstructor,
  coerceNumberProperty,
  NgtCommonCamera,
  NumberInput,
  provideCommonCameraRef,
  provideNgtCommonCamera,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-orthographic-camera',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonCamera(NgtOrthographicCamera),
    provideCommonCameraRef(NgtOrthographicCamera),
  ],
})
export class NgtOrthographicCamera extends NgtCommonCamera<THREE.OrthographicCamera> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.OrthographicCamera>
    | undefined;

  @Input() set left(left: NumberInput) {
    this.set({ left: coerceNumberProperty(left) });
  }

  @Input() set right(right: NumberInput) {
    this.set({ right: coerceNumberProperty(right) });
  }

  @Input() set top(top: NumberInput) {
    this.set({ top: coerceNumberProperty(top) });
  }

  @Input() set bottom(bottom: NumberInput) {
    this.set({ bottom: coerceNumberProperty(bottom) });
  }

  @Input() set near(near: NumberInput) {
    this.set({ near: coerceNumberProperty(near) });
  }

  @Input() set far(far: NumberInput) {
    this.set({ far: coerceNumberProperty(far) });
  }

  override get cameraType(): AnyConstructor<THREE.OrthographicCamera> {
    return THREE.OrthographicCamera;
  }

  protected override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      left: true,
      right: true,
      top: true,
      bottom: true,
      near: true,
      far: true,
    };
  }
}
