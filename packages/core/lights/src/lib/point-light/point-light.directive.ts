// GENERATED
import {
  NgtLight,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-point-light',
  exportAs: 'ngtPointLight',
  providers: [
    {
      provide: NgtLight,
      useExisting: NgtPointLight,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtPointLight extends NgtLight<THREE.PointLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.PointLight>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.PointLight>) {
    this.lightArgs = v;
  }

  lightType = THREE.PointLight;
}

@NgModule({
  declarations: [NgtPointLight],
  exports: [NgtPointLight, NgtObject3dControllerModule],
})
export class NgtPointLightModule {}
