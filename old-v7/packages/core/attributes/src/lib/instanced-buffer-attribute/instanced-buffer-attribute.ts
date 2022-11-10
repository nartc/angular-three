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
  selector: 'ngt-instanced-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    provideNgtCommonAttribute(NgtInstancedBufferAttribute),
    provideCommonAttributeRef(NgtInstancedBufferAttribute),
  ],
})
export class NgtInstancedBufferAttribute extends NgtCommonAttribute<THREE.InstancedBufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.InstancedBufferAttribute> | undefined;

  override get attributeType(): NgtAnyConstructor<THREE.InstancedBufferAttribute> {
    return THREE.InstancedBufferAttribute;
  }
}
