// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonCamera,
  provideNgtCommonCamera,
  provideCommonCameraRef,
  NgtObservableInput,
  coerceNumber,
  NgtNumberInput,
} from '@angular-three/core';
import { isObservable, map } from 'rxjs';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-perspective-camera',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCamera(NgtPerspectiveCamera), provideCommonCameraRef(NgtPerspectiveCamera)],
})
export class NgtPerspectiveCamera extends NgtCommonCamera<THREE.PerspectiveCamera> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PerspectiveCamera> | undefined;

  @Input() set fov(fov: NgtObservableInput<NgtNumberInput>) {
    this.set({ fov: isObservable(fov) ? fov.pipe(map(coerceNumber)) : coerceNumber(fov) });
  }

  @Input() set aspect(aspect: NgtObservableInput<NgtNumberInput>) {
    this.set({ aspect: isObservable(aspect) ? aspect.pipe(map(coerceNumber)) : coerceNumber(aspect) });
  }

  @Input() set near(near: NgtObservableInput<NgtNumberInput>) {
    this.set({ near: isObservable(near) ? near.pipe(map(coerceNumber)) : coerceNumber(near) });
  }

  @Input() set far(far: NgtObservableInput<NgtNumberInput>) {
    this.set({ far: isObservable(far) ? far.pipe(map(coerceNumber)) : coerceNumber(far) });
  }

  override get cameraType(): NgtAnyConstructor<THREE.PerspectiveCamera> {
    return THREE.PerspectiveCamera;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'fov', 'aspect', 'near', 'far'];
  }
}
