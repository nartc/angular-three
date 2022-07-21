// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-capsule-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtCapsuleGeometry)],
})
export class NgtCapsuleGeometry extends NgtCommonGeometry<THREE.CapsuleGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.CapsuleGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.CapsuleGeometry> {
    return THREE.CapsuleGeometry;
  }
}

@NgModule({
  imports: [NgtCapsuleGeometry],
  exports: [NgtCapsuleGeometry],
})
export class NgtCapsuleGeometryModule {}
