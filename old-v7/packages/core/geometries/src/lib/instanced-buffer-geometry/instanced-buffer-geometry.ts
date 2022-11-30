// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonGeometry,
  provideCommonGeometryRef,
  provideNgtCommonGeometry,
} from '@angular-three/core';
import { Component } from '@angular/core';
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
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.InstancedBufferGeometry> | undefined;

  override get geometryType(): NgtAnyConstructor<THREE.InstancedBufferGeometry> {
    return THREE.InstancedBufferGeometry;
  }
}
