// GENERATED
import {
  NgtLight,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-light-probe',
  exportAs: 'ngtLightProbe',
  providers: [
    {
      provide: NgtLight,
      useExisting: NgtLightProbe,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtLightProbe extends NgtLight<THREE.LightProbe> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.LightProbe>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.LightProbe>) {
    this.lightArgs = v;
  }

  lightType = THREE.LightProbe;
}

@NgModule({
  declarations: [NgtLightProbe],
  exports: [NgtLightProbe, NgtObject3dControllerModule],
})
export class NgtLightProbeModule {}
