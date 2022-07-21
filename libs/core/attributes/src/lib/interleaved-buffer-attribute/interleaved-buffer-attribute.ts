// GENERATED
import { AnyConstructor, NgtCommonAttribute, provideCommonAttributeRef } from '@angular-three/core';
import { NgModule, Component } from '@angular/core';
import * as THREE from 'three/src/Three';

@Component({
  selector: 'ngt-interleaved-buffer-attribute',
  standalone: true,
  template: '<ng-content></ng-content>',
  providers: [provideCommonAttributeRef(NgtInterleavedBufferAttribute)],
})
export class NgtInterleavedBufferAttribute extends NgtCommonAttribute<THREE.InterleavedBufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.InterleavedBufferAttribute> | undefined;

  override get attributeType(): AnyConstructor<THREE.InterleavedBufferAttribute> {
    return THREE.InterleavedBufferAttribute;
  }
}

@NgModule({
  imports: [NgtInterleavedBufferAttribute],
  exports: [NgtInterleavedBufferAttribute],
})
export class NgtInterleavedBufferAttributeModule {}
