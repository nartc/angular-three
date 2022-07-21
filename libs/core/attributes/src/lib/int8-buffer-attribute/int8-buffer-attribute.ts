// GENERATED
import { AnyConstructor, NgtCommonAttribute, provideCommonAttributeRef } from '@angular-three/core';
import { NgModule, Component } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-int8-buffer-attribute',
  template: '<ng-content></ng-content>',
  providers: [provideCommonAttributeRef(NgtInt8BufferAttribute)],
})
export class NgtInt8BufferAttribute extends NgtCommonAttribute<THREE.Int8BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Int8BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.Int8BufferAttribute> {
    return THREE.Int8BufferAttribute;
  }
}

@NgModule({
  declarations: [NgtInt8BufferAttribute],
  exports: [NgtInt8BufferAttribute],
})
export class NgtInt8BufferAttributeModule {}
