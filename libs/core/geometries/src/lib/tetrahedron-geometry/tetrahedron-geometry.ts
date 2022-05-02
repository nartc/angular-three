// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-tetrahedron-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtTetrahedronGeometry)],
})
export class NgtTetrahedronGeometry extends NgtCommonGeometry<THREE.TetrahedronGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.TetrahedronGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.TetrahedronGeometry> {
    return THREE.TetrahedronGeometry;
  }
}

@NgModule({
  declarations: [NgtTetrahedronGeometry],
  exports: [NgtTetrahedronGeometry],
})
export class NgtTetrahedronGeometryModule {}
