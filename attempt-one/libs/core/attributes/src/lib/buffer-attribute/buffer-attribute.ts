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
  selector: 'ngt-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    provideNgtCommonAttribute(NgtBufferAttribute),
    provideCommonAttributeRef(NgtBufferAttribute)
  ],
})
export class NgtBufferAttribute extends NgtCommonAttribute<THREE.BufferAttribute> {

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.BufferAttribute> {
      return THREE.BufferAttribute;
  }
}
