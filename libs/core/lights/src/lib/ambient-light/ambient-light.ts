// GENERATED
import { AnyConstructor, NgtCommonLight, provideCommonLightRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, Input, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-ambient-light',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonLightRef(NgtAmbientLight)],
})
export class NgtAmbientLight extends NgtCommonLight<THREE.AmbientLight> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.AmbientLight> | undefined;

  override get lightType(): AnyConstructor<THREE.AmbientLight> {
    return THREE.AmbientLight;
  }
}

@NgModule({
  imports: [NgtAmbientLight],
  exports: [NgtAmbientLight],
})
export class NgtAmbientLightModule {}
