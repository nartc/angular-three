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
  selector: 'ngt-lathe-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideNgtCommonGeometry(NgtLatheGeometry), provideCommonGeometryRef(NgtLatheGeometry)],
})
export class NgtLatheGeometry extends NgtCommonGeometry<THREE.LatheGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.LatheGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.LatheGeometry> {
    return THREE.LatheGeometry;
  }
}

@NgModule({
  imports: [NgtLatheGeometry],
  exports: [NgtLatheGeometry],
})
export class NgtLatheGeometryModule {}
