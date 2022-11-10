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
  selector: 'ngt-sphere-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtSphereGeometry), provideCommonGeometryRef(NgtSphereGeometry)],
})
export class NgtSphereGeometry extends NgtCommonGeometry<THREE.SphereGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.SphereGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.SphereGeometry> {
    return THREE.SphereGeometry;
  }
}
