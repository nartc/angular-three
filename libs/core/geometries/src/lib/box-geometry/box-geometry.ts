// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-box-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtBoxGeometry)],
})
export class NgtBoxGeometry extends NgtCommonGeometry<THREE.BoxGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.BoxGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.BoxGeometry> {
    return THREE.BoxGeometry;
  }
}

@NgModule({
  declarations: [NgtBoxGeometry],
  exports: [NgtBoxGeometry],
})
export class NgtBoxGeometryModule {}
