// GENERATED
import { AnyConstructor, NgtCommonAttribute, provideCommonAttributeRef } from '@angular-three/core';
import { NgModule, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-uint16-buffer-attribute',
  template: '<ng-content></ng-content>',
  providers: [provideCommonAttributeRef(NgtUint16BufferAttribute)],
})
export class NgtUint16BufferAttribute extends NgtCommonAttribute<THREE.Uint16BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Uint16BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.Uint16BufferAttribute> {
    return THREE.Uint16BufferAttribute;
  }
}

@NgModule({
  declarations: [NgtUint16BufferAttribute],
  exports: [NgtUint16BufferAttribute],
})
export class NgtUint16BufferAttributeModule {}
