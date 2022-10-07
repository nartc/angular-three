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

  override get attributeType(): AnyConstructor<THREE.InstancedBufferAttribute> {
    return THREE.InstancedBufferAttribute;
  }
}

@NgModule({
  imports: [NgtInstancedBufferAttribute],
  exports: [NgtInstancedBufferAttribute],
})
export class NgtInstancedBufferAttributeModule {}
