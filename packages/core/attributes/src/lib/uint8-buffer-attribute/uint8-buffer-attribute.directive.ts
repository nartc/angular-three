// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-uint8-buffer-attribute',
  exportAs: 'ngtUint8BufferAttribute',
  providers: [
    {
      provide: NgtAttribute,
      useExisting: NgtUint8BufferAttribute,
    },
  ],
})
export class NgtUint8BufferAttribute extends NgtAttribute<THREE.Uint8BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.Uint8BufferAttribute>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof THREE.Uint8BufferAttribute>
  ) {
    this.extraArgs = v;
  }

  attributeType = THREE.Uint8BufferAttribute;
}
