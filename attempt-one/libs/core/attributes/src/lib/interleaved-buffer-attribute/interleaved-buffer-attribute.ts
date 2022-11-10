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
  selector: 'ngt-interleaved-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    provideNgtCommonAttribute(NgtInterleavedBufferAttribute),
    provideCommonAttributeRef(NgtInterleavedBufferAttribute)
  ],
})
export class NgtInterleavedBufferAttribute extends NgtCommonAttribute<THREE.InterleavedBufferAttribute> {

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.InterleavedBufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.InterleavedBufferAttribute> {
      return THREE.InterleavedBufferAttribute;
  }
}
