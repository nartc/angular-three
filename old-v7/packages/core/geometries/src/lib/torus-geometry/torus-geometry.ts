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
  selector: 'ngt-torus-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtTorusGeometry), provideCommonGeometryRef(NgtTorusGeometry)],
})
export class NgtTorusGeometry extends NgtCommonGeometry<THREE.TorusGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.TorusGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.TorusGeometry> {
    return THREE.TorusGeometry;
  }
}
