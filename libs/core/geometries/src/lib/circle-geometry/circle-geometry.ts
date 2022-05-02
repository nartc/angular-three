// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-circle-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtCircleGeometry)],
})
export class NgtCircleGeometry extends NgtCommonGeometry<THREE.CircleGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CircleGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.CircleGeometry> {
    return THREE.CircleGeometry;
  }
}

@NgModule({
  declarations: [NgtCircleGeometry],
  exports: [NgtCircleGeometry],
})
export class NgtCircleGeometryModule {}
