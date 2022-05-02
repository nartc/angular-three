// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-octahedron-geometry',
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
  declarations: [NgtOctahedronGeometry],
  exports: [NgtOctahedronGeometry],
})
export class NgtOctahedronGeometryModule {}
