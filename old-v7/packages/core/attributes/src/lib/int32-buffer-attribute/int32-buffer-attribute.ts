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
  selector: 'ngt-int32-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonAttribute(NgtInt32BufferAttribute), provideCommonAttributeRef(NgtInt32BufferAttribute)],
})
export class NgtInt32BufferAttribute extends NgtCommonAttribute<THREE.Int32BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Int32BufferAttribute> | undefined;

  override get attributeType(): NgtAnyConstructor<THREE.Int32BufferAttribute> {
    return THREE.Int32BufferAttribute;
  }
}
