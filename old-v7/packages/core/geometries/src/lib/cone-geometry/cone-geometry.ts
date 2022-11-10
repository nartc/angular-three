// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonGeometry,
  provideNgtCommonGeometry,
  provideCommonGeometryRef,
} from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-cone-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtConeGeometry), provideCommonGeometryRef(NgtConeGeometry)],
})
export class NgtConeGeometry extends NgtCommonGeometry<THREE.ConeGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.ConeGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.ConeGeometry> {
    return THREE.ConeGeometry;
  }
}
