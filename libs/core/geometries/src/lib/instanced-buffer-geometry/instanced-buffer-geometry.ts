// GENERATED - AngularThree v7.0.0
import {
  AnyConstructor,
  NgtCommonGeometry,
  provideNgtCommonGeometry,
  provideCommonGeometryRef,
} from '@angular-three/core';
import { ChangeDetectionStrategy, Component, NgModule } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-instanced-buffer-geometry',
  standalone: true,
  template: '<ng-content></ng-content>',

  providers: [
    provideNgtCommonGeometry(NgtInstancedBufferGeometry),
    provideCommonGeometryRef(NgtInstancedBufferGeometry),
  ],
})
export class NgtInstancedBufferGeometry extends NgtCommonGeometry<THREE.InstancedBufferGeometry> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.InstancedBufferGeometry>
    | undefined;

  override get geometryType(): AnyConstructor<THREE.InstancedBufferGeometry> {
    return THREE.InstancedBufferGeometry;
  }
}
