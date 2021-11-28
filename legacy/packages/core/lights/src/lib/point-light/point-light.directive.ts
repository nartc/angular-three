// GENERATED

import { NgtLight, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
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
    {
      provide: NgtObject3d,
      useExisting: NgtPointLight,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtPointLight extends NgtLight<THREE.PointLight> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PointLight> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.PointLight>) {
    this.extraArgs = v;
  }

  lightType = THREE.PointLight;
}

@NgModule({
  declarations: [NgtPointLight],
  exports: [NgtPointLight],
})
export class NgtPointLightModule {}

