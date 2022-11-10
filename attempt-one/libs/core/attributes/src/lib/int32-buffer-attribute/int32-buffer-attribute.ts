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
  selector: 'ngt-int32-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    provideNgtCommonAttribute(NgtInt32BufferAttribute),
    provideCommonAttributeRef(NgtInt32BufferAttribute)
  ],
})
export class NgtInt32BufferAttribute extends NgtCommonAttribute<THREE.Int32BufferAttribute> {

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Int32BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.Int32BufferAttribute> {
      return THREE.Int32BufferAttribute;
  }
}
