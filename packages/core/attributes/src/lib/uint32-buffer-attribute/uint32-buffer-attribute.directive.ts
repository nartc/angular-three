// GENERATED

import { Directive, Input } from '@angular/core';
import { Uint32BufferAttribute } from 'three';
import { ThreeAttribute } from '../abstracts';

@Directive({
  selector: 'ngt-uint32BufferAttribute',
  exportAs: 'ngtUint32BufferAttribute',
  providers: [
    {
      provide: ThreeAttribute,
      useExisting: Uint32BufferAttributeDirective,
    },
  ],
})
export class Uint32BufferAttributeDirective extends ThreeAttribute<Uint32BufferAttribute> {
  static ngAcceptInputType_args: ConstructorParameters<typeof Uint32BufferAttribute> | undefined;

  @Input() set args(v: ConstructorParameters<typeof Uint32BufferAttribute>) {
    this.extraArgs = v;
  }

  attributeType = Uint32BufferAttribute;
}
