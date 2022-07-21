// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-polyhedron-geometry',
  standalone: true,
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
  imports: [NgtPolyhedronGeometry],
  exports: [NgtPolyhedronGeometry],
})
export class NgtPolyhedronGeometryModule {}
