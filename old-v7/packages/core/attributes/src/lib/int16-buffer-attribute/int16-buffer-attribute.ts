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
  selector: 'ngt-int16-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonAttribute(NgtInt16BufferAttribute), provideCommonAttributeRef(NgtInt16BufferAttribute)],
})
export class NgtInt16BufferAttribute extends NgtCommonAttribute<THREE.Int16BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Int16BufferAttribute> | undefined;

  override get attributeType(): NgtAnyConstructor<THREE.Int16BufferAttribute> {
    return THREE.Int16BufferAttribute;
  }
}
