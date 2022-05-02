// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-dodecahedron-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtDodecahedronGeometry)],
})
export class NgtDodecahedronGeometry extends NgtCommonGeometry<THREE.DodecahedronGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.DodecahedronGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.DodecahedronGeometry> {
    return THREE.DodecahedronGeometry;
  }
}

@NgModule({
  declarations: [NgtDodecahedronGeometry],
  exports: [NgtDodecahedronGeometry],
})
export class NgtDodecahedronGeometryModule {}
