// GENERATED

import { Directive, Input } from '@angular/core';
import { Uint8ClampedBufferAttribute } from 'three';
import { ThreeAttribute } from '../abstracts';

@Directive({
  selector: 'ngt-uint8ClampedBufferAttribute',
  exportAs: 'ngtUint8ClampedBufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Uint8ClampedBufferAttributeDirective,
    },
  ],
})
export class Uint8ClampedBufferAttributeDirective extends ThreeAttribute<Uint8ClampedBufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof Uint8ClampedBufferAttribute> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Uint8ClampedBufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Uint8ClampedBufferAttribute;
}
