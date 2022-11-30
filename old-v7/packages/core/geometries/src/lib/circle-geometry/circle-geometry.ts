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
  selector: 'ngt-circle-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtCircleGeometry), provideCommonGeometryRef(NgtCircleGeometry)],
})
export class NgtCircleGeometry extends NgtCommonGeometry<THREE.CircleGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CircleGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.CircleGeometry> {
    return THREE.CircleGeometry;
  }
}
