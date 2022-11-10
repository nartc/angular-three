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
  selector: 'ngt-float16-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    provideNgtCommonAttribute(NgtFloat16BufferAttribute),
    provideCommonAttributeRef(NgtFloat16BufferAttribute),
  ],
})
export class NgtFloat16BufferAttribute extends NgtCommonAttribute<THREE.Float16BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Float16BufferAttribute> | undefined;

  override get attributeType(): NgtAnyConstructor<THREE.Float16BufferAttribute> {
    return THREE.Float16BufferAttribute;
  }
}
