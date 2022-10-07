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
  selector: 'ngt-int8-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideNgtCommonAttribute(NgtInt8BufferAttribute), provideCommonAttributeRef(NgtInt8BufferAttribute)],
})
export class NgtInt8BufferAttribute extends NgtCommonAttribute<THREE.Int8BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Int8BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.Int8BufferAttribute> {
    return THREE.Int8BufferAttribute;
  }
}

@NgModule({
  imports: [NgtInt8BufferAttribute],
  exports: [NgtInt8BufferAttribute],
})
export class NgtInt8BufferAttributeModule {}
