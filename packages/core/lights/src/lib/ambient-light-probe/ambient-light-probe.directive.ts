// GENERATED
import {
  NgtLight,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-ambient-light-probe',
  exportAs: 'ngtAmbientLightProbe',
  providers: [
    {
      provide: NgtLight,
      useExisting: NgtAmbientLightProbe,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtAmbientLightProbe extends NgtLight<THREE.AmbientLightProbe> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.AmbientLightProbe>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.AmbientLightProbe>) {
    this.lightArgs = v;
  }

  lightType = THREE.AmbientLightProbe;
}

@NgModule({
  declarations: [NgtAmbientLightProbe],
  exports: [NgtAmbientLightProbe, NgtObject3dControllerModule],
})
export class NgtAmbientLightProbeModule {}
