// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { NgModule, Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-int16-buffer-attribute',
  exportAs: 'ngtInt16BufferAttribute',
  providers: [
    {
      provide: NgtAttribute,
      useExisting: NgtInt16BufferAttribute,
    },
  ],
})
export class NgtInt16BufferAttribute extends NgtAttribute<THREE.Int16BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.Int16BufferAttribute>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof THREE.Int16BufferAttribute>
  ) {
    this.attributeArgs = v;
  }

  attributeType = THREE.Int16BufferAttribute;
}

@NgModule({
  declarations: [NgtInt16BufferAttribute],
  exports: [NgtInt16BufferAttribute],
})
export class NgtInt16BufferAttributeModule {}
