// GENERATED
import {
  AnyConstructor,
  NgtCommonGeometry,
  provideNgtCommonGeometry,
  provideCommonGeometryRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-icosahedron-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonGeometry(NgtIcosahedronGeometry), provideCommonGeometryRef(NgtIcosahedronGeometry)],
})
export class NgtIcosahedronGeometry extends NgtCommonGeometry<THREE.IcosahedronGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.IcosahedronGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.IcosahedronGeometry> {
    return THREE.IcosahedronGeometry;
  }
}

@NgModule({
  imports: [NgtIcosahedronGeometry],
  exports: [NgtIcosahedronGeometry],
})
export class NgtIcosahedronGeometryModule {}
