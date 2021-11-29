// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-uint16-buffer-attribute',
  exportAs: 'ngtUint16BufferAttribute',
  providers: [
    {
      provide: NgtAttribute,
      useExisting: NgtUint16BufferAttribute,
    },
  ],
})
export class NgtUint16BufferAttribute extends NgtAttribute<THREE.Uint16BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.Uint16BufferAttribute>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof THREE.Uint16BufferAttribute>
  ) {
    this.attributeArgs = v;
  }

  attributeType = THREE.Uint16BufferAttribute;
}

@NgModule({
  declarations: [NgtUint16BufferAttribute],
  exports: [NgtUint16BufferAttribute],
})
export class NgtUint16BufferAttributeModule {}
