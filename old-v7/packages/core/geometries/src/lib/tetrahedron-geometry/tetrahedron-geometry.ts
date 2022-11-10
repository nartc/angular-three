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
  selector: 'ngt-tetrahedron-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtTetrahedronGeometry), provideCommonGeometryRef(NgtTetrahedronGeometry)],
})
export class NgtTetrahedronGeometry extends NgtCommonGeometry<THREE.TetrahedronGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.TetrahedronGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.TetrahedronGeometry> {
    return THREE.TetrahedronGeometry;
  }
}
