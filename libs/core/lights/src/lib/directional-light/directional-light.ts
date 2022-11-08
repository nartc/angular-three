// GENERATED
import {
  AnyConstructor,
  NgtCommonLight,
  provideNgtCommonLight,
  provideCommonLightRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-directional-light',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    provideNgtCommonLight(NgtDirectionalLight),
    provideCommonLightRef(NgtDirectionalLight),
  ],
})
export class NgtDirectionalLight extends NgtCommonLight<THREE.DirectionalLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.DirectionalLight>
    | undefined;

  @Input() set target(target: THREE.Object3D) {
    this.set({ target });
  }

  override get lightType(): AnyConstructor<THREE.DirectionalLight> {
    return THREE.DirectionalLight;
  }

  override get optionsFields(): Record<string, boolean> {
    return {
      ...super.optionsFields,
      target: true,
    };
  }
}
