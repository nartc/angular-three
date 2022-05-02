// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-torus-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtTorusGeometry)],
})
export class NgtTorusGeometry extends NgtCommonGeometry<THREE.TorusGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.TorusGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.TorusGeometry> {
    return THREE.TorusGeometry;
  }
}

@NgModule({
  declarations: [NgtTorusGeometry],
  exports: [NgtTorusGeometry],
})
export class NgtTorusGeometryModule {}
