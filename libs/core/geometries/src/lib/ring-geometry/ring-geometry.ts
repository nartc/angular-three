// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-ring-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtRingGeometry)],
})
export class NgtRingGeometry extends NgtCommonGeometry<THREE.RingGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.RingGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.RingGeometry> {
    return THREE.RingGeometry;
  }
}

@NgModule({
  declarations: [NgtRingGeometry],
  exports: [NgtRingGeometry],
})
export class NgtRingGeometryModule {}
