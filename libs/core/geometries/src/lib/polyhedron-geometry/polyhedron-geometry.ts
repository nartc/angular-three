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
  selector: 'ngt-polyhedron-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonGeometry(NgtPolyhedronGeometry), provideCommonGeometryRef(NgtPolyhedronGeometry)],
})
export class NgtPolyhedronGeometry extends NgtCommonGeometry<THREE.PolyhedronGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PolyhedronGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.PolyhedronGeometry> {
    return THREE.PolyhedronGeometry;
  }
}

@NgModule({
  imports: [NgtPolyhedronGeometry],
  exports: [NgtPolyhedronGeometry],
})
export class NgtPolyhedronGeometryModule {}
