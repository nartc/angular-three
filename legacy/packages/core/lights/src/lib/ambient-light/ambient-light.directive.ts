// GENERATED

import { NgtLight, NgtObject3d, NGT_OBJECT_3D_CONTROLLER_PROVIDER } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-ambient-light',
  exportAs: 'ngtAmbientLight',
  providers: [
    {
      provide: NgtLight,
      useExisting: NgtAmbientLight,
    },
    {
      provide: NgtObject3d,
      useExisting: NgtAmbientLight,
    },
    NGT_OBJECT_3D_CONTROLLER_PROVIDER,
  ],
})
export class NgtAmbientLight extends NgtLight<THREE.AmbientLight> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.AmbientLight> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.AmbientLight>) {
    this.extraArgs = v;
  }

  lightType = THREE.AmbientLight;
}

@NgModule({
  declarations: [NgtAmbientLight],
  exports: [NgtAmbientLight],
})
export class NgtAmbientLightModule {}

