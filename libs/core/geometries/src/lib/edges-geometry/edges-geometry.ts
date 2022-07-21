// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-edges-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtEdgesGeometry)],
})
export class NgtEdgesGeometry extends NgtCommonGeometry<THREE.EdgesGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.EdgesGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.EdgesGeometry> {
    return THREE.EdgesGeometry;
  }
}

@NgModule({
  declarations: [NgtEdgesGeometry],
  exports: [NgtEdgesGeometry],
})
export class NgtEdgesGeometryModule {}
