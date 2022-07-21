// GENERATED
import { AnyConstructor, NgtCommonAttribute, provideCommonAttributeRef } from '@angular-three/core';
import { NgModule, Component } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideCommonAttributeRef(NgtBufferAttribute)],
})
export class NgtBufferAttribute extends NgtCommonAttribute<THREE.BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.BufferAttribute> {
    return THREE.BufferAttribute;
  }
}

@NgModule({
  imports: [NgtBufferAttribute],
  exports: [NgtBufferAttribute],
})
export class NgtBufferAttributeModule {}
