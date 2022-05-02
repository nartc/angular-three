// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-lathe-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtLatheGeometry)],
})
export class NgtLatheGeometry extends NgtCommonGeometry<THREE.LatheGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.LatheGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.LatheGeometry> {
    return THREE.LatheGeometry;
  }
}

@NgModule({
  declarations: [NgtLatheGeometry],
  exports: [NgtLatheGeometry],
})
export class NgtLatheGeometryModule {}
