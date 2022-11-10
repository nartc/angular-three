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
  selector: 'ngt-uint8-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    provideNgtCommonAttribute(NgtUint8BufferAttribute),
    provideCommonAttributeRef(NgtUint8BufferAttribute)
  ],
})
export class NgtUint8BufferAttribute extends NgtCommonAttribute<THREE.Uint8BufferAttribute> {

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Uint8BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.Uint8BufferAttribute> {
      return THREE.Uint8BufferAttribute;
  }
}
