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
  selector: 'ngt-ring-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtRingGeometry), provideCommonGeometryRef(NgtRingGeometry)],
})
export class NgtRingGeometry extends NgtCommonGeometry<THREE.RingGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.RingGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.RingGeometry> {
    return THREE.RingGeometry;
  }
}
