// GENERATED

import { Directive, Input } from '@angular/core';
import { Uint8BufferAttribute } from 'three';
import { ThreeAttribute } from '../abstracts';

@Directive({
  selector: 'ngt-uint8BufferAttribute',
  exportAs: 'ngtUint8BufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Uint8BufferAttributeDirective,
    },
  ],
})
export class Uint8BufferAttributeDirective extends ThreeAttribute<Uint8BufferAttribute> {
  static ngAcceptInputType_args:
    | ConstructorParameters<typeof Uint8BufferAttribute>
    | undefined;

  @Input() set args(v: ConstructorParameters<typeof Uint8BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Uint8BufferAttribute;
}
