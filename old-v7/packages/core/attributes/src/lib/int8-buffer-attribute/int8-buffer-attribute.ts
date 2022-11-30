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
  selector: 'ngt-int8-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonAttribute(NgtInt8BufferAttribute), provideCommonAttributeRef(NgtInt8BufferAttribute)],
})
export class NgtInt8BufferAttribute extends NgtCommonAttribute<THREE.Int8BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Int8BufferAttribute> | undefined;

  override get attributeType(): NgtAnyConstructor<THREE.Int8BufferAttribute> {
    return THREE.Int8BufferAttribute;
  }
}
