// GENERATED
import { AnyConstructor, NgtCommonGeometry, provideCommonGeometryRef } from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-instanced-buffer-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideCommonGeometryRef(NgtInstancedBufferGeometry)],
})
export class NgtInstancedBufferGeometry extends NgtCommonGeometry<THREE.InstancedBufferGeometry> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.InstancedBufferGeometry> | undefined;

  get geometryType(): AnyConstructor<THREE.InstancedBufferGeometry> {
    return THREE.InstancedBufferGeometry;
  }
}

@NgModule({
  imports: [NgtInstancedBufferGeometry],
  exports: [NgtInstancedBufferGeometry],
})
export class NgtInstancedBufferGeometryModule {}
