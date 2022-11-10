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
  selector: 'ngt-orthographic-camera',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonCamera(NgtOrthographicCamera), provideCommonCameraRef(NgtOrthographicCamera)],
})
export class NgtOrthographicCamera extends NgtCommonCamera<THREE.OrthographicCamera> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.OrthographicCamera> | undefined;

  @Input() set left(left: NgtObservableInput<NgtNumberInput>) {
    this.set({ left: isObservable(left) ? left.pipe(map(coerceNumber)) : coerceNumber(left) });
  }

  @Input() set right(right: NgtObservableInput<NgtNumberInput>) {
    this.set({ right: isObservable(right) ? right.pipe(map(coerceNumber)) : coerceNumber(right) });
  }

  @Input() set top(top: NgtObservableInput<NgtNumberInput>) {
    this.set({ top: isObservable(top) ? top.pipe(map(coerceNumber)) : coerceNumber(top) });
  }

  @Input() set bottom(bottom: NgtObservableInput<NgtNumberInput>) {
    this.set({ bottom: isObservable(bottom) ? bottom.pipe(map(coerceNumber)) : coerceNumber(bottom) });
  }

  @Input() set near(near: NgtObservableInput<NgtNumberInput>) {
    this.set({ near: isObservable(near) ? near.pipe(map(coerceNumber)) : coerceNumber(near) });
  }

  @Input() set far(far: NgtObservableInput<NgtNumberInput>) {
    this.set({ far: isObservable(far) ? far.pipe(map(coerceNumber)) : coerceNumber(far) });
  }

  override get cameraType(): NgtAnyConstructor<THREE.OrthographicCamera> {
    return THREE.OrthographicCamera;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'left', 'right', 'top', 'bottom', 'near', 'far'];
  }
}
