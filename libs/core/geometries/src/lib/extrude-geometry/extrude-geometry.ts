// GENERATED
import {
  AnyConstructor,
  NgtCommonGeometry,
  provideNgtCommonGeometry,
  provideCommonGeometryRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-extrude-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonGeometry(NgtExtrudeGeometry), provideCommonGeometryRef(NgtExtrudeGeometry)],
})
export class NgtExtrudeGeometry extends NgtCommonGeometry<THREE.ExtrudeGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.ExtrudeGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.ExtrudeGeometry> {
    return THREE.ExtrudeGeometry;
  }
}

@NgModule({
  imports: [NgtExtrudeGeometry],
  exports: [NgtExtrudeGeometry],
})
export class NgtExtrudeGeometryModule {}
