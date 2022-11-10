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
  selector: 'ngt-octahedron-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtOctahedronGeometry), provideCommonGeometryRef(NgtOctahedronGeometry)],
})
export class NgtOctahedronGeometry extends NgtCommonGeometry<THREE.OctahedronGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.OctahedronGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.OctahedronGeometry> {
    return THREE.OctahedronGeometry;
  }
}
