// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonAttribute,
  provideNgtCommonAttribute,
  provideCommonAttributeRef,
} from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-float32-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    provideNgtCommonAttribute(NgtFloat32BufferAttribute),
    provideCommonAttributeRef(NgtFloat32BufferAttribute),
  ],
})
export class NgtFloat32BufferAttribute extends NgtCommonAttribute<THREE.Float32BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Float32BufferAttribute> | undefined;

  override get attributeType(): NgtAnyConstructor<THREE.Float32BufferAttribute> {
    return THREE.Float32BufferAttribute;
  }
}