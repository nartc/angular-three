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
  selector: 'ngt-spot-light',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonLight(NgtSpotLight), provideCommonLightRef(NgtSpotLight)],
})
export class NgtSpotLight extends NgtCommonLight<THREE.SpotLight> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.SpotLight> | undefined;

  @Input() set distance(distance: NgtObservableInput<NgtNumberInput>) {
    this.set({ distance: isObservable(distance) ? distance.pipe(map(coerceNumber)) : coerceNumber(distance) });
  }

  @Input() set angle(angle: NgtObservableInput<NgtNumberInput>) {
    this.set({ angle: isObservable(angle) ? angle.pipe(map(coerceNumber)) : coerceNumber(angle) });
  }

  @Input() set penumbra(penumbra: NgtObservableInput<NgtNumberInput>) {
    this.set({ penumbra: isObservable(penumbra) ? penumbra.pipe(map(coerceNumber)) : coerceNumber(penumbra) });
  }

  @Input() set decay(decay: NgtObservableInput<NgtNumberInput>) {
    this.set({ decay: isObservable(decay) ? decay.pipe(map(coerceNumber)) : coerceNumber(decay) });
  }

  @Input() set target(target: NgtObservableInput<THREE.Object3D>) {
    this.set({ target });
  }

  @Input() set power(power: NgtObservableInput<NgtNumberInput>) {
    this.set({ power: isObservable(power) ? power.pipe(map(coerceNumber)) : coerceNumber(power) });
  }

  override get lightType(): NgtAnyConstructor<THREE.SpotLight> {
    return THREE.SpotLight;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'distance', 'angle', 'penumbra', 'decay', 'target', 'power'];
  }
}
