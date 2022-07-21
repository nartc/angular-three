// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-tube-geometry',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtTubeGeometry)],
})
export class NgtTubeGeometry extends NgtCommonGeometry<THREE.TubeGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.TubeGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.TubeGeometry> {
    return THREE.TubeGeometry;
  }
}

@NgModule({
  declarations: [NgtTubeGeometry],
  exports: [NgtTubeGeometry],
})
export class NgtTubeGeometryModule {}
