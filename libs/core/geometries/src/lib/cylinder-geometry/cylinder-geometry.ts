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
  selector: 'ngt-cylinder-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonGeometry(NgtCylinderGeometry), provideCommonGeometryRef(NgtCylinderGeometry)],
})
export class NgtCylinderGeometry extends NgtCommonGeometry<THREE.CylinderGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CylinderGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.CylinderGeometry> {
    return THREE.CylinderGeometry;
  }
}

@NgModule({
  imports: [NgtCylinderGeometry],
  exports: [NgtCylinderGeometry],
})
export class NgtCylinderGeometryModule {}
