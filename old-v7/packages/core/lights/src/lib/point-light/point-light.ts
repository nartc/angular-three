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
  selector: 'ngt-point-light',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonLight(NgtPointLight), provideCommonLightRef(NgtPointLight)],
})
export class NgtPointLight extends NgtCommonLight<THREE.PointLight> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PointLight> | undefined;

  @Input() set distance(distance: NgtObservableInput<NgtNumberInput>) {
    this.set({ distance: isObservable(distance) ? distance.pipe(map(coerceNumber)) : coerceNumber(distance) });
  }

  @Input() set decay(decay: NgtObservableInput<NgtNumberInput>) {
    this.set({ decay: isObservable(decay) ? decay.pipe(map(coerceNumber)) : coerceNumber(decay) });
  }

  @Input() set power(power: NgtObservableInput<NgtNumberInput>) {
    this.set({ power: isObservable(power) ? power.pipe(map(coerceNumber)) : coerceNumber(power) });
  }

  override get lightType(): NgtAnyConstructor<THREE.PointLight> {
    return THREE.PointLight;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'distance', 'decay', 'power'];
  }
}
