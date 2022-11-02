// GENERATED
import {
  AnyConstructor,
  NgtCommonLight,
  provideCommonLightRef,
  provideNgtCommonLight,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-ambient-light',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonLight(NgtAmbientLight),
    provideCommonLightRef(NgtAmbientLight),
  ],
})
export class NgtAmbientLight extends NgtCommonLight<THREE.AmbientLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.AmbientLight>
    | undefined;

  override get lightType(): AnyConstructor<THREE.AmbientLight> {
    return THREE.AmbientLight;
  }
}
