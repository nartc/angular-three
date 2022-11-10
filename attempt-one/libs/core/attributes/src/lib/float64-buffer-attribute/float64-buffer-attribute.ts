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
  selector: 'ngt-float64-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    provideNgtCommonAttribute(NgtFloat64BufferAttribute),
    provideCommonAttributeRef(NgtFloat64BufferAttribute)
  ],
})
export class NgtFloat64BufferAttribute extends NgtCommonAttribute<THREE.Float64BufferAttribute> {

  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Float64BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.Float64BufferAttribute> {
      return THREE.Float64BufferAttribute;
  }
}
