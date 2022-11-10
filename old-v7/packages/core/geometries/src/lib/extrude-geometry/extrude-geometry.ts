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
  selector: 'ngt-extrude-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtExtrudeGeometry), provideCommonGeometryRef(NgtExtrudeGeometry)],
})
export class NgtExtrudeGeometry extends NgtCommonGeometry<THREE.ExtrudeGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.ExtrudeGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.ExtrudeGeometry> {
    return THREE.ExtrudeGeometry;
  }
}
