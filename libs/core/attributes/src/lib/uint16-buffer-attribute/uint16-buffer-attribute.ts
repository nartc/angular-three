// GENERATED
import {
  AnyConstructor,
  NgtCommonAttribute,
  provideNgtCommonAttribute,
  provideCommonAttributeRef,
} from '@angular-three/core';
import { NgModule, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-uint16-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonAttribute(NgtUint16BufferAttribute), provideCommonAttributeRef(NgtUint16BufferAttribute)],
})
export class NgtUint16BufferAttribute extends NgtCommonAttribute<THREE.Uint16BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Uint16BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.Uint16BufferAttribute> {
    return THREE.Uint16BufferAttribute;
  }
}

@NgModule({
  imports: [NgtUint16BufferAttribute],
  exports: [NgtUint16BufferAttribute],
})
export class NgtUint16BufferAttributeModule {}
