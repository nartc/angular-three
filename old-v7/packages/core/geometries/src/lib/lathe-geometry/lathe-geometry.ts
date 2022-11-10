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
  selector: 'ngt-lathe-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtLatheGeometry), provideCommonGeometryRef(NgtLatheGeometry)],
})
export class NgtLatheGeometry extends NgtCommonGeometry<THREE.LatheGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.LatheGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.LatheGeometry> {
    return THREE.LatheGeometry;
  }
}
