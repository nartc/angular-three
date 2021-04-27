// GENERATED
import { ThreeAttribute } from '@angular-three/core';
import { Directive, Input } from '@angular/core';
import { Uint8ClampedBufferAttribute } from 'three';

@Directive({
  selector: 'ngt-uint8-clamped-buffer-attribute',
  exportAs: 'ngtUint8ClampedBufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Uint8ClampedBufferAttributeDirective,
    },
  ],
})
export class Uint8ClampedBufferAttributeDirective extends ThreeAttribute<Uint8ClampedBufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Uint8ClampedBufferAttribute>
    | undefined;

  @Input() set args(
    v: ConstructorParameters<typeof Uint8ClampedBufferAttribute>
  ) {
    this.extraArgs = v;
  }

  attributeType = Uint8ClampedBufferAttribute;
}
