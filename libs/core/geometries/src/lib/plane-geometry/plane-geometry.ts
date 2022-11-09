// GENERATED - AngularThree v7.0.0
import {
  AnyConstructor,
  NgtCommonGeometry,
  provideNgtCommonGeometry,
  provideCommonGeometryRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-plane-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonGeometry(NgtPlaneGeometry),
    provideCommonGeometryRef(NgtPlaneGeometry),
  ],
})
export class NgtPlaneGeometry extends NgtCommonGeometry<THREE.PlaneGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.PlaneGeometry>
    | undefined;

  override get geometryType(): AnyConstructor<THREE.PlaneGeometry> {
    return THREE.PlaneGeometry;
  }
}
