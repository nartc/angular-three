// GENERATED
import { NgtAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ngt-uint8-clamped-buffer-attribute',
  exportAs: 'ngtUint8ClampedBufferAttribute',
  providers: [
    {
      provide: NgtAttribute,
      useExisting: NgtUint8ClampedBufferAttribute,
    },
  ],
})
export class NgtUint8ClampedBufferAttribute extends NgtAttribute<THREE.Uint8ClampedBufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof THREE.Uint8ClampedBufferAttribute>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof THREE.Uint8ClampedBufferAttribute>
  ) {
    this.extraArgs = v;
  }

  attributeType = THREE.Uint8ClampedBufferAttribute;
}
