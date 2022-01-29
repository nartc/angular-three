// GENERATED
import {
  NgtLight,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-spot-light',
  exportAs: 'ngtSpotLight',
  providers: [
    {
      provide: NgtLight,
      useExisting: NgtSpotLight,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtSpotLight extends NgtLight<THREE.SpotLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.SpotLight>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.SpotLight>) {
    this.lightArgs = v;
  }

  lightType = THREE.SpotLight;
}

@NgModule({
  declarations: [NgtSpotLight],
  exports: [NgtSpotLight, NgtObject3dControllerModule],
})
export class NgtSpotLightModule {}
