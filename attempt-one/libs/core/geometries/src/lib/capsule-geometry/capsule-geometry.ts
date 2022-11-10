// GENERATED - AngularThree v7.0.0
import {
  AnyConstructor,
  NgtCommonGeometry,
  provideNgtCommonGeometry,
  provideCommonGeometryRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-capsule-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonGeometry(NgtCapsuleGeometry),
    provideCommonGeometryRef(NgtCapsuleGeometry),
  ],
})
export class NgtCapsuleGeometry extends NgtCommonGeometry<THREE.CapsuleGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.CapsuleGeometry>
    | undefined;

  override get geometryType(): AnyConstructor<THREE.CapsuleGeometry> {
    return THREE.CapsuleGeometry;
  }
}
