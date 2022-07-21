// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-torus-knot-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtTorusKnotGeometry)],
})
export class NgtTorusKnotGeometry extends NgtCommonGeometry<THREE.TorusKnotGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.TorusKnotGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.TorusKnotGeometry> {
    return THREE.TorusKnotGeometry;
  }
}

@NgModule({
  declarations: [NgtTorusKnotGeometry],
  exports: [NgtTorusKnotGeometry],
})
export class NgtTorusKnotGeometryModule {}
