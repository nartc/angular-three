// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-interleaved-buffer-attribute',
  exportAs: 'ngtInterleavedBufferAttribute',
  providers: [
    {
      provide: NgtAttribute,
      useExisting: NgtInterleavedBufferAttribute,
    },
  ],
})
export class NgtInterleavedBufferAttribute extends NgtAttribute<THREE.InterleavedBufferAttribute> {
  
  static ngAcceptInputType_args: ConstructorParameters<typeof THREE.InterleavedBufferAttribute> | undefined;

  @Input() set args(v: ConstructorParameters<typeof THREE.InterleavedBufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = THREE.InterleavedBufferAttribute;
}
