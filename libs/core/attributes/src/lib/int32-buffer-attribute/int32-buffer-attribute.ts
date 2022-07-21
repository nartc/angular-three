// GENERATED
import { AnyConstructor, NgtCommonAttribute, provideCommonAttributeRef } from '@angular-three/core';
import { NgModule, Component } from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'ngt-int32-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideCommonAttributeRef(NgtInt32BufferAttribute)],
})
export class NgtInt32BufferAttribute extends NgtCommonAttribute<THREE.Int32BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.Int32BufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.Int32BufferAttribute> {
    return THREE.Int32BufferAttribute;
  }
}

@NgModule({
  imports: [NgtInt32BufferAttribute],
  exports: [NgtInt32BufferAttribute],
})
export class NgtInt32BufferAttributeModule {}
