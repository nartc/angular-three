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
  selector: 'ngt-box-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtBoxGeometry), provideCommonGeometryRef(NgtBoxGeometry)],
})
export class NgtBoxGeometry extends NgtCommonGeometry<THREE.BoxGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.BoxGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.BoxGeometry> {
    return THREE.BoxGeometry;
  }
}
