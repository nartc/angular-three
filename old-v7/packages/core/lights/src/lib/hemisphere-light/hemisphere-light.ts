// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonLight,
  NgtObservableInput,
  provideCommonLightRef,
  provideNgtCommonLight,
} from '@angular-three/core';
import { Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-hemisphere-light',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonLight(NgtHemisphereLight), provideCommonLightRef(NgtHemisphereLight)],
})
export class NgtHemisphereLight extends NgtCommonLight<THREE.HemisphereLight> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.HemisphereLight> | undefined;

  @Input() set skyColor(skyColor: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ skyColor });
  }

  @Input() set groundColor(groundColor: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ groundColor });
  }

  override get lightType(): NgtAnyConstructor<THREE.HemisphereLight> {
    return THREE.HemisphereLight;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'skyColor', 'groundColor'];
  }
}
