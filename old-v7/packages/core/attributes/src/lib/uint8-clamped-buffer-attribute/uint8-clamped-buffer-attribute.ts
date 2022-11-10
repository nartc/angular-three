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
  selector: 'ngt-uint8-clamped-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [
    provideNgtCommonAttribute(NgtUint8ClampedBufferAttribute),
    provideCommonAttributeRef(NgtUint8ClampedBufferAttribute),
  ],
})
export class NgtUint8ClampedBufferAttribute extends NgtCommonAttribute<THREE.Uint8ClampedBufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Uint8ClampedBufferAttribute> | undefined;

  override get attributeType(): NgtAnyConstructor<THREE.Uint8ClampedBufferAttribute> {
    return THREE.Uint8ClampedBufferAttribute;
  }
}
