// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonLight,
  provideNgtCommonLight,
  provideCommonLightRef,
  NgtObservableInput,
  coerceNumber,
  NgtNumberInput,
} from '@angular-three/core';
import { isObservable, map } from 'rxjs';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-rect-area-light',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonLight(NgtRectAreaLight), provideCommonLightRef(NgtRectAreaLight)],
})
export class NgtRectAreaLight extends NgtCommonLight<THREE.RectAreaLight> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.RectAreaLight> | undefined;

  @Input() set width(width: NgtObservableInput<NgtNumberInput>) {
    this.set({ width: isObservable(width) ? width.pipe(map(coerceNumber)) : coerceNumber(width) });
  }

  @Input() set height(height: NgtObservableInput<NgtNumberInput>) {
    this.set({ height: isObservable(height) ? height.pipe(map(coerceNumber)) : coerceNumber(height) });
  }

  @Input() set power(power: NgtObservableInput<NgtNumberInput>) {
    this.set({ power: isObservable(power) ? power.pipe(map(coerceNumber)) : coerceNumber(power) });
  }

  override get lightType(): NgtAnyConstructor<THREE.RectAreaLight> {
    return THREE.RectAreaLight;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'width', 'height', 'power'];
  }
}
