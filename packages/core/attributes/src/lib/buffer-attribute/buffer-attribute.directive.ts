// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-buffer-attribute',
  exportAs: 'ngtBufferAttribute',
  providers: [
    {
      provide: NgtAttribute,
      useExisting: NgtBufferAttribute,
    },
  ],
})
export class NgtBufferAttribute extends NgtAttribute<THREE.BufferAttribute> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.BufferAttribute> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = THREE.BufferAttribute;
}
