// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-uint32-buffer-attribute',
  exportAs: 'ngtUint32BufferAttribute',
  providers: [
    {
      provide: NgtAttribute,
      useExisting: NgtUint32BufferAttribute,
    },
  ],
})
export class NgtUint32BufferAttribute extends NgtAttribute<THREE.Uint32BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.Uint32BufferAttribute>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof THREE.Uint32BufferAttribute>
  ) {
    this.extraArgs = v;
  }

  attributeType = THREE.Uint32BufferAttribute;
}
