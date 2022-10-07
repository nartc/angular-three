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
  selector: 'ngt-tube-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonGeometry(NgtTubeGeometry), provideCommonGeometryRef(NgtTubeGeometry)],
})
export class NgtTubeGeometry extends NgtCommonGeometry<THREE.TubeGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.TubeGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.TubeGeometry> {
    return THREE.TubeGeometry;
  }
}

@NgModule({
  imports: [NgtTubeGeometry],
  exports: [NgtTubeGeometry],
})
export class NgtTubeGeometryModule {}
