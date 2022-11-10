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
  selector: 'ngt-torus-knot-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonGeometry(NgtTorusKnotGeometry), provideCommonGeometryRef(NgtTorusKnotGeometry)],
})
export class NgtTorusKnotGeometry extends NgtCommonGeometry<THREE.TorusKnotGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.TorusKnotGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.TorusKnotGeometry> {
    return THREE.TorusKnotGeometry;
  }
}
