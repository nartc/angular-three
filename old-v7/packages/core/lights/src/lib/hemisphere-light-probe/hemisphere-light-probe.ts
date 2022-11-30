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
  selector: 'ngt-hemisphere-light-probe',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonLight(NgtHemisphereLightProbe), provideCommonLightRef(NgtHemisphereLightProbe)],
})
export class NgtHemisphereLightProbe extends NgtCommonLight<THREE.HemisphereLightProbe> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.HemisphereLightProbe> | undefined;

  @Input() set skyColor(skyColor: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ skyColor });
  }

  @Input() set groundColor(groundColor: NgtObservableInput<THREE.ColorRepresentation>) {
    this.set({ groundColor });
  }

  override get lightType(): NgtAnyConstructor<THREE.HemisphereLightProbe> {
    return THREE.HemisphereLightProbe;
  }

  override get optionsFields() {
    return [...super.optionsFields, 'skyColor', 'groundColor'];
  }
}
