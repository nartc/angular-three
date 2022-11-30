// GENERATED - AngularThree v7.0.0
import {
  NgtAnyConstructor,
  NgtCommonAttribute,
  provideCommonAttributeRef,
  provideNgtCommonAttribute,
} from '@angular-three/core';
import { Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-uint16-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonAttribute(NgtUint16BufferAttribute), provideCommonAttributeRef(NgtUint16BufferAttribute)],
})
export class NgtUint16BufferAttribute extends NgtCommonAttribute<THREE.Uint16BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Uint16BufferAttribute> | undefined;

  override get attributeType(): NgtAnyConstructor<THREE.Uint16BufferAttribute> {
    return THREE.Uint16BufferAttribute;
  }
}
