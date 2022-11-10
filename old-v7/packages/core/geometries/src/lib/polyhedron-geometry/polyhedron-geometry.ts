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
  selector: 'ngt-polyhedron-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtPolyhedronGeometry), provideCommonGeometryRef(NgtPolyhedronGeometry)],
})
export class NgtPolyhedronGeometry extends NgtCommonGeometry<THREE.PolyhedronGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PolyhedronGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.PolyhedronGeometry> {
    return THREE.PolyhedronGeometry;
  }
}
