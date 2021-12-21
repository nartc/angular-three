// GENERATED
import {
  NgtLight,
  NGT_OBJECT_CONTROLLER_PROVIDER,
  NgtObject3dControllerModule,
} from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-rect-area-light',
  exportAs: 'ngtRectAreaLight',
  providers: [
    {
      provide: NgtLight,
      useExisting: NgtRectAreaLight,
    },
    NGT_OBJECT_CONTROLLER_PROVIDER,
  ],
})
export class NgtRectAreaLight extends NgtLight<THREE.RectAreaLight> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.RectAreaLight>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.RectAreaLight>) {
    this.lightArgs = v;
  }

  lightType = THREE.RectAreaLight;
}

@NgModule({
  declarations: [NgtRectAreaLight],
  exports: [NgtRectAreaLight, NgtObject3dControllerModule],
})
export class NgtRectAreaLightModule {}
