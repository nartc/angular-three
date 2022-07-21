// GENERATED
import { AnyConstructor, NgtCommonAttribute, provideCommonAttributeRef } from '@angular-three/core';
import { NgModule, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-float16-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideCommonAttributeRef(NgtFloat16BufferAttribute)],
})
export class NgtFloat16BufferAttribute extends NgtCommonAttribute<THREE.Float16BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Float16BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.Float16BufferAttribute> {
    return THREE.Float16BufferAttribute;
  }
}

@NgModule({
  imports: [NgtFloat16BufferAttribute],
  exports: [NgtFloat16BufferAttribute],
})
export class NgtFloat16BufferAttributeModule {}
