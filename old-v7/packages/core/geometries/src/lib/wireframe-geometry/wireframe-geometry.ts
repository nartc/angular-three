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
  selector: 'ngt-wireframe-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtWireframeGeometry), provideCommonGeometryRef(NgtWireframeGeometry)],
})
export class NgtWireframeGeometry extends NgtCommonGeometry<THREE.WireframeGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.WireframeGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.WireframeGeometry> {
    return THREE.WireframeGeometry;
  }
}
