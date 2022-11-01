// GENERATED
import {
    AnyConstructor,
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
    provideCommonAttributeRef(NgtFloat32BufferAttribute)
  ],
})
export class NgtFloat32BufferAttribute extends NgtCommonAttribute<THREE.Float32BufferAttribute> {

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Float32BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.Float32BufferAttribute> {
      return THREE.Float32BufferAttribute;
  }
}
