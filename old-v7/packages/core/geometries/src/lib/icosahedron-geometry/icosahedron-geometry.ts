// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonGeometry,
  provideCommonGeometryRef,
  provideNgtCommonGeometry,
} from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-icosahedron-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtIcosahedronGeometry), provideCommonGeometryRef(NgtIcosahedronGeometry)],
})
export class NgtIcosahedronGeometry extends NgtCommonGeometry<THREE.IcosahedronGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.IcosahedronGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.IcosahedronGeometry> {
    return THREE.IcosahedronGeometry;
  }
}
