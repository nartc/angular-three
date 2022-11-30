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
  selector: 'ngt-dodecahedron-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtDodecahedronGeometry), provideCommonGeometryRef(NgtDodecahedronGeometry)],
})
export class NgtDodecahedronGeometry extends NgtCommonGeometry<THREE.DodecahedronGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.DodecahedronGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.DodecahedronGeometry> {
    return THREE.DodecahedronGeometry;
  }
}
