// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-sphere-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtSphereGeometry)],
})
export class NgtSphereGeometry extends NgtCommonGeometry<THREE.SphereGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.SphereGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.SphereGeometry> {
    return THREE.SphereGeometry;
  }
}

@NgModule({
  declarations: [NgtSphereGeometry],
  exports: [NgtSphereGeometry],
})
export class NgtSphereGeometryModule {}
