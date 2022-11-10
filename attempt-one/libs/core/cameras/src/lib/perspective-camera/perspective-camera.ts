// GENERATED
import {
  AnyConstructor,
  NgtCommonCamera,
  provideNgtCommonCamera,
  provideCommonCameraRef,
  coerceNumberProperty,
  NumberInput,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-perspective-camera',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonCamera(NgtPerspectiveCamera),
    provideCommonCameraRef(NgtPerspectiveCamera),
  ],
})
export class NgtPerspectiveCamera extends NgtCommonCamera<THREE.PerspectiveCamera> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.PerspectiveCamera>
    | undefined;

  @Input() set fov(fov: NumberInput) {
    this.set({ fov: coerceNumberProperty(fov) });
  }

  @Input() set aspect(aspect: NumberInput) {
    this.set({ aspect: coerceNumberProperty(aspect) });
  }

  @Input() set near(near: NumberInput) {
    this.set({ near: coerceNumberProperty(near) });
  }

  @Input() set far(far: NumberInput) {
    this.set({ far: coerceNumberProperty(far) });
  }

  override get cameraType(): AnyConstructor<THREE.PerspectiveCamera> {
    return THREE.PerspectiveCamera;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      fov: true,
      aspect: true,
      near: true,
      far: true,
    };
  }
}
