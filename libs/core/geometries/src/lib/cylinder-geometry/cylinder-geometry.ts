// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-cylinder-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtCylinderGeometry)],
})
export class NgtCylinderGeometry extends NgtCommonGeometry<THREE.CylinderGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CylinderGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.CylinderGeometry> {
    return THREE.CylinderGeometry;
  }
}

@NgModule({
  declarations: [NgtCylinderGeometry],
  exports: [NgtCylinderGeometry],
})
export class NgtCylinderGeometryModule {}
