// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
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
    this.extraArgs = v;
  }

  attributeType = THREE.Uint16BufferAttribute;
}
