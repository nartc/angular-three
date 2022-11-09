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
  selector: 'ngt-tetrahedron-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonGeometry(NgtTetrahedronGeometry),
    provideCommonGeometryRef(NgtTetrahedronGeometry),
  ],
})
export class NgtTetrahedronGeometry extends NgtCommonGeometry<THREE.TetrahedronGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.TetrahedronGeometry>
    | undefined;

  override get geometryType(): AnyConstructor<THREE.TetrahedronGeometry> {
    return THREE.TetrahedronGeometry;
  }
}
