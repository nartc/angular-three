// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-octahedron-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtOctahedronGeometry)],
})
export class NgtOctahedronGeometry extends NgtCommonGeometry<THREE.OctahedronGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.OctahedronGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.OctahedronGeometry> {
    return THREE.OctahedronGeometry;
  }
}

@NgModule({
  imports: [NgtOctahedronGeometry],
  exports: [NgtOctahedronGeometry],
})
export class NgtOctahedronGeometryModule {}
