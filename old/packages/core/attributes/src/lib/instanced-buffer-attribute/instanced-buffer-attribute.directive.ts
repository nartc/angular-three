// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-instanced-buffer-attribute',
  exportAs: 'ngtInstancedBufferAttribute',
  providers: [
    {
      provide: NgtAttribute,
      useExisting: NgtInstancedBufferAttribute,
    },
  ],
})
export class NgtInstancedBufferAttribute extends NgtAttribute<THREE.InstancedBufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.InstancedBufferAttribute>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof THREE.InstancedBufferAttribute>
  ) {
    this.attributeArgs = v;
  }

  attributeType = THREE.InstancedBufferAttribute;
}

@NgModule({
  declarations: [NgtInstancedBufferAttribute],
  exports: [NgtInstancedBufferAttribute],
})
export class NgtInstancedBufferAttributeModule {}
