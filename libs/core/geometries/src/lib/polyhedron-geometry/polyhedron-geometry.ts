// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-polyhedron-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtPolyhedronGeometry)],
})
export class NgtPolyhedronGeometry extends NgtCommonGeometry<THREE.PolyhedronGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.PolyhedronGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.PolyhedronGeometry> {
    return THREE.PolyhedronGeometry;
  }
}

@NgModule({
  declarations: [NgtPolyhedronGeometry],
  exports: [NgtPolyhedronGeometry],
})
export class NgtPolyhedronGeometryModule {}
