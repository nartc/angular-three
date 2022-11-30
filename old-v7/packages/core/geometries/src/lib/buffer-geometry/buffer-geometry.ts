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
  selector: 'ngt-buffer-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtBufferGeometry), provideCommonGeometryRef(NgtBufferGeometry)],
})
export class NgtBufferGeometry extends NgtCommonGeometry<THREE.BufferGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.BufferGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.BufferGeometry> {
    return THREE.BufferGeometry;
  }
}
